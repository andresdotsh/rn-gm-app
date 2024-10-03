/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import useTheme from '@/hooks/useTheme'
import colors from '@/constants/colors'

export default function useThemeColor(colorName, props) {
  const theme = useTheme()

  const colorFromProps = props?.[theme]

  const result = colorFromProps || colors[theme][colorName]

  if (result && typeof result === 'string') {
    return result
  } else {
    // return red for non existing color
    return '#ff0000'
  }
}
