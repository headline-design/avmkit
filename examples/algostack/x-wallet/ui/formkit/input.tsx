import { cn } from '@/dashboard/lib/utils';
import { useState } from 'react';

const InputField = ({
  label,
  labelAction,
  name,
  ...props
}: {
  label: string;
  labelAction?: any;
  name: string;
  [key: string]: any;
}) => {
  const [inFocus, setInFocus] = useState(false);
  return (
    <div className={cn("xwallet-input xwallet-input-xl" , inFocus ? 'focus' : '',)}>
      <div
        className={cn(labelAction ? 'xwallet-top-between' : '', 'xwallet-label xwallet-label-xl')}
      >
        <span className="xwallet-label-text ">{label}</span>
        {labelAction && <span className="xwallet-label-action">{labelAction}</span>}
      </div>
      <div
        className="xwallet-input-box no-padding-right"
        onFocus={() => setInFocus(true)}
      >
        {props.prefix && <div className="xwallet-input-prefix">{props.prefix}</div>}
        <input type="hidden" autoComplete="off" readOnly style={{ display: 'none' }} />
        <input
          onBlur={() => setInFocus(false)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          defaultValue=""
          name={name}
          {...props}
        />
        {props.suffix && <div className="xwallet-input-suffix">{props.suffix}</div>}
      </div>
    </div>
  );
};

export default InputField;
