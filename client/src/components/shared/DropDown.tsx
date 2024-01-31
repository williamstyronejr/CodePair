import { useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import './styles/dropdown.css';

const DropDown = ({
  options,
  value,
  changeValue,
  title = '',
  className = ' ',
}: {
  options: string[];
  value: string;
  title?: string;
  changeValue: (option: string) => void;
  className?: string;
}) => {
  const [active, setActive] = useState(false);
  const ref = useOutsideClick({
    active,
    closeEvent: () => {
      setActive(false);
    },
    ignoreButton: true,
  });

  return (
    <>
      <div className={`dropdown ${className}`} ref={ref}>
        <div className={`${active ? 'dropdown__active' : ''}`}>
          <button
            className="dropdown__toggle"
            type="button"
            onClick={() => {
              setActive((old) => !old);
            }}
          >
            <div className="dropdown__current">
              {value !== '' ? value : title}
            </div>

            <span className="dropdown__arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.929 7.913l7.078 7.057 7.064-7.057a1 1 0 111.414 1.414l-7.77 7.764a1 1 0 01-1.415 0L3.515 9.328a1 1 0 011.414-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </button>

          <div className="dropdown__menu">
            <div
              className={`dropdown__list ${
                active ? 'dropdown__list--active' : ''
              } `}
            >
              {options.map((option) => (
                <button
                  key={`select-${option}`}
                  className="transition-colors dropdown__option"
                  type="button"
                  onClick={() => {
                    setActive(false);
                    changeValue(option);
                  }}
                  disabled={value === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropDown;
