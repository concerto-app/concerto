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
import { useSettings } from "../contexts/settings";
import useAppSelector from "../hooks/useAppSelector";
import { useMidi } from "../contexts/midi";
import { usePlayer } from "../contexts/player";

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

export default function Settings({ navigation }: SettingsProps) {
  const midi = useMidi();
  const player = usePlayer();
  const settings = useSettings();

  const code = useAppSelector((state) => state.code.code);
  const users = useAppSelector((state) => state.users.users);

  const handleCloseButtonPress = useCallback(
    () => navigation.goBack(),
    [navigation]
  );

  const handleNoteOnSliderComplete = React.useCallback(
    (value: number | number[]) =>
      settings.noteOnVelocity.setValue(() =>
        (Array.isArray(value) ? value[0] : value).toString()
      ),
    [settings.noteOnVelocity.setValue]
  );

  const handleNoteOffSliderComplete = React.useCallback(
    (value: number | number[]) =>
      settings.noteOffVelocity.setValue(() =>
        (Array.isArray(value) ? value[0] : value).toString()
      ),
    [settings.noteOffVelocity.setValue]
  );

  const handleInstrumentPickerChange = React.useCallback(
    (value: string) => settings.instrument.setValue(() => value),
    [settings.instrument.setValue]
  );

  const handleMidiInputPickerChange = React.useCallback(
    (value: string) => settings.midiInput.setValue(() => value),
    [settings.midiInput.setValue]
  );

  if (!code) return null;

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
                    {users.map((user) => (
                      <Marker
                        key={user.id}
                        size={sizes.userMarker}
                        style={{ marginRight: margins.userMarker }}
                      >
                        <Emoji
                          id={user.emoji}
                          size={(sizes.userMarker * 3) / 5}
                        />
                      </Marker>
                    ))}
                  </ReactNative.View>
                </ScrollView>
              </ReactNative.View>
            </Subsection>
          </Section>
          <Section title="Settings">
            {settings.noteOnVelocity.value === undefined ? null : (
              <Subsection title="Note On Velocity">
                <Slider
                  value={Number(settings.noteOnVelocity.value)}
                  minimumValue={0.0}
                  maximumValue={1.0}
                  onSlidingComplete={handleNoteOnSliderComplete}
                />
              </Subsection>
            )}
            {settings.noteOffVelocity.value === undefined ? null : (
              <Subsection title="Note Off Velocity">
                <Slider
                  value={Number(settings.noteOffVelocity.value)}
                  minimumValue={0.0}
                  maximumValue={1.0}
                  onSlidingComplete={handleNoteOffSliderComplete}
                />
              </Subsection>
            )}
            {settings.instrument.value === undefined ? null : (
              <Subsection title="Instrument">
                <Picker
                  placeholder={{}}
                  value={settings.instrument.value}
                  items={player.instruments}
                  onValueChange={handleInstrumentPickerChange}
                />
              </Subsection>
            )}
            {settings.midiInput.value === undefined ? null : (
              <Subsection title="MIDI Input">
                <Picker
                  placeholder={{}}
                  value={settings.midiInput.value}
                  items={midi.inputs}
                  onValueChange={handleMidiInputPickerChange}
                />
              </Subsection>
            )}
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
