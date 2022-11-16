import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
const xxx = () => {
  const [mapRegion, setmapRegion] = useState({
    latitude: 32.3077232604,
    longitude: 34.87780799875718,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <View style={styles.container}>
      <MapView
        style={{ alignSelf: "stretch", height: "100%" }}
        region={mapRegion}
      >
        <Marker coordinate={mapRegion} title="Marker" />
      </MapView>
    </View>
  );
};
export default xxx;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
