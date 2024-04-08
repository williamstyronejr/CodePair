package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/docker/docker/api/types/container"
	network "github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	natting "github.com/docker/go-connections/nat"
	amqp "github.com/rabbitmq/amqp091-go"
)

func runContainer(client *client.Client, containerName string, imageName string, port string, inputEnv []string) {
	newport, err := natting.NewPort("tcp", port)

	if err != nil {
		fmt.Println("Docker port not available")
	}

	hostConfig := &container.HostConfig{
		PortBindings: natting.PortMap{
			newport: []natting.PortBinding{
				{
					HostIP: "0.0.0.0",
					HostPort: port,
				},
			},
		},
		RestartPolicy: container.RestartPolicy{
			Name: "always",
		},
		LogConfig: container.LogConfig{
			Type:   "json-file",
			Config: map[string]string{},
		},
	}

	networkConfig := &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{},
	}
	gatewayConfig := &network.EndpointSettings{
		Gateway: "gatewayname",
	}
	networkConfig.EndpointsConfig["bridge"] = gatewayConfig

	exposedPorts := map[natting.Port]struct{}{
		newport: struct{}{},
	}

	config := &container.Config{
		Image: imageName,
		Env: inputEnv,
		ExposedPorts: exposedPorts,
		Hostname: fmt.Sprintf("%s-hostnameexample", imageName),
	}


	cont, err := client.ContainerCreate(
		context.Background(),
		config,
		hostConfig,
		networkConfig,
		nil,
		containerName,
	)

	client.ContainerStart(context.Background(), cont.ID, container.StartOptions{})
}

func sendMessage(channel amqp.Channel) {
	err := channel.PublishWithContext(
		context.TODO(),
		"",
		"code-queue",
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body: []byte("Message"),
		},
	)

	if err != nil {
		panic(err)
	}
}

func setupCosumer(channel amqp.Channel) {
	msgs, err := channel.Consume(
		"",
		"code-api",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		panic(err)
	}

	forever := make(chan bool)
	go func() {
		for msg := range msgs {
			fmt.Printf("Message: %s\n", msg.Body)
		}
	}()

	fmt.Println("Connected To Server Awaiting Messages")
	<-forever
}

func createTempFolder() error {
	path := filepath.Join("temp", "code")
	err := os.MkdirAll(path, os.ModePerm)

	return err
}


func main() {
	jsonHandler := slog.NewTextHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	logger.Info("Initiazing Server")

	err := createTempFolder()

	if err != nil {
		panic("Error creating temp folders")
	}


	connection, err := amqp.Dial("amqps://zyaaskac:Zyh0JojcAgUQEC8ZUldmVh03KBkRQ0qO@moose.rmq.cloudamqp.com/zyaaskac")
	if err != nil {
		panic(err)
	}

	defer connection.Close()



	fmt.Println("Connected to amqp server, Awaiting Request ...")

	channel, err := connection.Channel()

	if err != nil {
		panic(err)
	}

	defer channel.Close()

	queue, err := channel.QueueDeclare(
		"code-api",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		panic(err)
	}

	sendMessage(*channel)
	fmt.Println("Queue status: ", queue)
	fmt.Println("Published message")


	client, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}




	// setupCosumer(*channel)
}