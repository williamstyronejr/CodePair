import { useState } from 'react';

export default function Input({
  label,
  name,
  type,
  initVal,
  error,
}: {
  label: string;
  name: string;
  type: string;
  initVal?: string;
  error?: string;
}) {
  const [input, setInput] = useState(initVal || '');

  return (
    <div className="form__field">
      <label className="form__label" htmlFor={name}>
        <span className="form__labeling">{label}</span>

        {error && (
          <span className="form__error" data-cy="error">
            {error}
          </span>
        )}

        <input
          id={name}
          name={name}
          className="form__input form__input--text"
          type={type}
          placeholder={label}
          value={input}
          onChange={(evt) => setInput(evt.target.value)}
          data-cy="username"
        />
      </label>
    </div>
  );
}
