'use client'
import { cn } from '@/lib/utils'

const fieldBase =
  'w-full border border-text2 bg-bg px-3.5 py-2.5 text-[13px] text-text1 placeholder:text-text2 transition-colors focus:border-text1 focus:bg-surface'

export function FieldLabel({ children, className, htmlFor, ...props }) {
  return (
    <label htmlFor={htmlFor} className={cn('mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-text2', className)} {...props}>
      {children}
    </label>
  )
}

export function FieldInput({ className, id, error, ...props }) {
  return (
    <>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        className={cn(fieldBase, error && 'border-red-600', className)}
        {...props}
      />
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="mt-1 font-mono text-[11px] text-red-700">
          {error}
        </p>
      )}
    </>
  )
}

export function FieldTextarea({ className, id, error, ...props }) {
  return (
    <>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        className={cn(fieldBase, 'resize-none', error && 'border-red-600', className)}
        {...props}
      />
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="mt-1 font-mono text-[11px] text-red-700">
          {error}
        </p>
      )}
    </>
  )
}

export function FieldSelect({ className, id, error, children, ...props }) {
  return (
    <>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        className={cn(fieldBase, 'cursor-pointer appearance-none bg-no-repeat pr-8', error && 'border-red-600', className)}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23111111' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundPosition: 'right 12px center' }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="mt-1 font-mono text-[11px] text-red-700">
          {error}
        </p>
      )}
    </>
  )
}
