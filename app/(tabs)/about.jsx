import { StyleSheet, ScrollView, Text } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import BlankSpaceView from '@/ui/BlankSpaceView'

export default function About() {
  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')

  return (
    <ScrollView style={[styles.container, { backgroundColor: mainBgColor }]}>
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
  container: {
    padding: 20,
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
