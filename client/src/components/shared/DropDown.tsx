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

            <span
              className={`transition-transform dropdown__arrow ${
                active ? '' : 'dropdown__arrow-rotated'
              }`}
            >
              &gt;
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
