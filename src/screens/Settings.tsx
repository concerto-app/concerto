import tw from "../tailwind";
import ReactNative from "react-native";
import { SettingsProps } from "../navigation/types";
import React, { useCallback } from "react";
import Heading from "../components/text/Heading";
import Marker from "../components/Marker";
import Icon from "../components/Icon";
import { BorderlessButton, ScrollView } from "react-native-gesture-handler";
import EmojiCode from "../components/emojis/EmojiCode";
import Emoji from "../components/emojis/Emoji";
import Indicator from "../components/Indicator";
import Slider from "../components/Slider";
import Picker from "../components/Picker";

const margins = {
  vertical: 16,
  horizontal: 32,
  code: 12,
  section: 45,
  subsection: 30,
  subsectionHeading: 15,
  userMarker: 15,
};

const fontSizes = {
  section: 40,
  subsection: 20,
};

const sizes = {
  closeButton: 45,
  userMarker: 45,
};

const closeButton = {
  size: sizes.closeButton,
  iconName: "close",
};

function Section({
  title,
  style,
  children,
  ...otherProps
}: ReactNative.ViewProps & { title: string }) {
  return (
    <ReactNative.View
      style={[style, { marginBottom: margins.section }]}
      {...otherProps}
    >
      <Heading style={{ fontSize: fontSizes.section, marginBottom: 0 }}>
        {title}
      </Heading>
      {children}
    </ReactNative.View>
  );
}

function Subsection({
  title,
  style,
  children,
  ...otherProps
}: ReactNative.ViewProps & { title: string }) {
  return (
    <ReactNative.View
      style={[style, { marginTop: margins.subsection }]}
      {...otherProps}
    >
      <Heading
        style={{
          fontSize: fontSizes.subsection,
          marginBottom: margins.subsectionHeading,
        }}
      >
        {title}
      </Heading>
      {children}
    </ReactNative.View>
  );
}

export default function Settings({ route, navigation }: SettingsProps) {
  const { code, users } = route.params;

  const handleCloseButtonPress = useCallback(() => navigation.goBack(), []);

  return (
    <ReactNative.View style={tw.style("flex-1", "bg-white")}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <ReactNative.View
          style={{
            marginHorizontal: margins.horizontal,
            marginVertical: margins.vertical,
          }}
        >
          <Section title="Room">
            <Subsection title="PIN">
              <EmojiCode
                code={code}
                length={code.length}
                margin={margins.code}
                style={{
                  marginHorizontal: -margins.code,
                  marginVertical: -margins.code,
                }}
              />
            </Subsection>
            <Subsection
              title="Players"
              style={{ flexDirection: "row", flexWrap: "wrap" }}
            >
              <ReactNative.View
                style={{
                  marginBottom: margins.subsectionHeading,
                  marginLeft: margins.subsectionHeading,
                  justifyContent: "center",
                }}
              >
                <Indicator
                  size={fontSizes.subsection}
                  text={users.length.toString()}
                />
              </ReactNative.View>
              <ReactNative.View style={{ flexBasis: "100%" }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={{ margin: -sizes.userMarker * 3 }}
                  contentContainerStyle={{ padding: sizes.userMarker * 3 }}
                >
                  <ReactNative.View style={{ flexDirection: "row" }}>
                    {users.map(([user, emoji]) => (
                      <Marker
                        key={user}
                        size={sizes.userMarker}
                        style={{ marginRight: margins.userMarker }}
                      >
                        <Emoji id={emoji} size={(sizes.userMarker * 3) / 5} />
                      </Marker>
                    ))}
                  </ReactNative.View>
                </ScrollView>
              </ReactNative.View>
            </Subsection>
          </Section>
          <Section title="Settings">
            <Subsection title="Note On Velocity">
              <Slider value={0} step={1} minimumValue={0} maximumValue={100} />
            </Subsection>
            <Subsection title="Note Off Velocity">
              <Slider value={0} step={1} minimumValue={0} maximumValue={100} />
            </Subsection>
            <Subsection title="MIDI Input">
              <Picker
                placeholder={{}}
                value="none"
                items={[{ label: "None", value: "none" }]}
              />
            </Subsection>
          </Section>
        </ReactNative.View>
      </ScrollView>
      <ReactNative.View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        <ReactNative.View
          style={{
            flex: 1,
            margin: margins.vertical,
            alignItems: "flex-end",
          }}
        >
          <BorderlessButton onPress={handleCloseButtonPress}>
            <Marker size={closeButton.size}>
              <Icon name="md-close" size={closeButton.size} />
            </Marker>
          </BorderlessButton>
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  );
}
