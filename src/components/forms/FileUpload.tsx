import React, { useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  value?: File | File[];
  onChange?: (files: File | File[] | null) => void;
  error?: string;
  containerClassName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '*',
  multiple = false,
  required = false,
  value,
  onChange,
  error,
  containerClassName = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      onChange?.(null);
      setFileName('');
      return;
    }

    if (multiple) {
      onChange?.(Array.from(files));
      setFileName(`${files.length}개 파일 선택됨`);
    } else {
      onChange?.(files[0]);
      setFileName(files[0].name);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange?.(null);
    setFileName('');
  };

  const displayValue = () => {
    if (fileName) return fileName;
    if (value) {
      if (Array.isArray(value)) {
        return `${value.length}개 파일 선택됨`;
      }
      return value.name;
    }
    return '';
  };

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <div className="flex items-center gap-2">
          <label className="text-base font-medium text-text-primary">
            {label}
          </label>
          {required && (
            <span className="text-sm text-primary">
              [필수]
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div
          className={`
            w-full px-4 py-2.5 pr-12
            border border-background-border rounded-md
            bg-white cursor-pointer
            flex items-center justify-between
            ${error ? 'border-danger' : ''}
          `}
        >
          <input
            type="text"
            readOnly
            value={displayValue()}
            placeholder="파일을 선택하세요"
            className="flex-1 text-sm bg-transparent outline-none cursor-pointer placeholder:text-text-muted"
            onClick={() => fileInputRef.current?.click()}
          />
          
          <div className="flex items-center gap-2">
            {displayValue() && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-background-secondary rounded"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1"
            >
              <Paperclip className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

interface ContractUploadProps {
  onFileSelect?: (file: File) => void;
  contractDate?: { from: string; to: string };
  onDateChange?: (dates: { from: string; to: string }) => void;
}

export const ContractUpload: React.FC<ContractUploadProps> = ({
  onFileSelect,
  contractDate = { from: '', to: '' },
  onDateChange,
}) => {
  return (
    <div className="space-y-6">
      <FileUpload
        label="임대차계약서"
        required
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(file) => file && !Array.isArray(file) && onFileSelect?.(file)}
      />
      
      <div className="space-y-4">
        <h3 className="text-base font-medium text-text-primary">계약날짜</h3>
        
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={contractDate.from}
            onChange={(e) => onDateChange?.({ ...contractDate, from: e.target.value })}
            className="flex-1 px-4 py-2.5 text-sm text-right border border-background-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0000-00-00"
          />
          <span className="text-base text-text-primary">부터</span>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={contractDate.to}
            onChange={(e) => onDateChange?.({ ...contractDate, to: e.target.value })}
            className="flex-1 px-4 py-2.5 text-sm text-right border border-background-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0000-00-00"
          />
          <span className="text-base text-text-primary">까지</span>
        </div>
      </div>
    </div>
  );
};