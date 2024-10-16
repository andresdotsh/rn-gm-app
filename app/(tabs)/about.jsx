import { StyleSheet, ScrollView, Text } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import BlankSpaceView from '@/ui/BlankSpaceView'
import { CC_WIDTH_STYLES } from '@/constants/constants'

export default function About() {
  const mainBg = useThemeColor('mainBg1')
  const textColor = useThemeColor('color1')

  return (
    <ScrollView
      style={{ backgroundColor: mainBg }}
      contentContainerStyle={styles.svContentContainer}
    >
      <Text style={[styles.title, { color: textColor }]}>
        Sobre este proyecto
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>
      <BlankSpaceView />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  svContentContainer: {
    flexGrow: 1,
    padding: 20,
    ...CC_WIDTH_STYLES,
  },
  title: {
    fontFamily: 'Ubuntu700',
    fontSize: 20,
    marginBottom: 20,
  },
  description: {
    fontFamily: 'Ubuntu400',
    fontSize: 18,
    marginBottom: 20,
  },
})
