declare module 'react-mobile-datepicker' {
  import { ReactElement } from 'react'

  interface DatePickerProps {
    value: Date
    isOpen: boolean
    onSelect: (date: Date) => void
    onCancel: () => void
    dateConfig: object
    theme?: string
    confirmText?: string
    cancelText?: string
    headerFormat?: string
    showCaption?: boolean
    locale?: object
  }

  export default function DatePicker(props: DatePickerProps): ReactElement
}
