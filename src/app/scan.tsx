import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import {
  BarcodeScanIcon,
  ActionButton,
  BackButton,
  PageHeader,
  SafeScreen,
} from "@/components/shop-ui";
import { products } from "@/data/products";

export default function ScanProductScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const hasProcessedScan = useRef(false);

  const requestCameraAccess = async () => {
    setIsRequesting(true);
    setPermissionError(null);
    try {
      await requestPermission();
    } catch (error) {
      console.error("Could not request camera permission.", error);
      setPermissionError("The camera permission request failed. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (hasProcessedScan.current) {
      return;
    }
    hasProcessedScan.current = true;

    const product = products.find((item) => item.barcode === data);
    if (!product) {
      setScanMessage(`No demo product matches barcode ${data}.`);
      return;
    }

    router.replace({ pathname: "/product/[id]", params: { id: product.id } });
  };

  if (!permission) {
    return (
      <SafeScreen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.green} />
        </View>
      </SafeScreen>
    );
  }

  if (!permission.granted) {
    return (
      <SafeScreen>
        <PageHeader
          title="Scan a product"
          left={<BackButton onPress={() => router.back()} />}
          right={<View style={styles.headerSpacer} />}
        />
        <View style={styles.permissionContent}>
          <View style={styles.cameraIcon}>
            <BarcodeScanIcon size={38} />
          </View>
          <Text style={styles.title}>Find it in a flash.</Text>
          <Text style={styles.description}>
            Allow camera access to scan a product barcode and open its details.
            Morrow does not take or save photos.
          </Text>
          {permissionError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {permissionError}
            </Text>
          ) : null}
          {permission.canAskAgain ? (
            <ActionButton
              title={isRequesting ? "Requesting access..." : "Allow camera access"}
              onPress={() => void requestCameraAccess()}
              disabled={isRequesting}
            />
          ) : (
            <Text style={styles.settingsNote}>
              Camera access is blocked. Enable it in your device settings to scan.
            </Text>
          )}
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <PageHeader
        title="Scan a product"
        left={<BackButton onPress={() => router.back()} />}
        right={<View style={styles.headerSpacer} />}
      />
      <View style={styles.content}>
        <Text style={styles.description}>
          Hold a product barcode inside the frame to see it in the shop.
        </Text>
        <View style={styles.cameraFrame}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
            }}
            onBarcodeScanned={scanMessage ? undefined : handleBarcodeScanned}
            onMountError={({ message }) => setCameraError(message)}
          />
          <View pointerEvents="none" style={styles.scanGuide}>
            <View style={styles.scanWindow} />
            <Text style={styles.guideText}>Place the barcode inside the frame</Text>
          </View>
        </View>
        {cameraError ? (
          <Text accessibilityRole="alert" style={styles.error}>
            Camera could not start: {cameraError}
          </Text>
        ) : null}
        {scanMessage ? (
          <View style={styles.scanFeedback}>
            <Text style={styles.feedbackText}>{scanMessage}</Text>
            <ActionButton
              title="Scan another code"
              variant="secondary"
              compact
              onPress={() => {
                hasProcessedScan.current = false;
                setScanMessage(null);
              }}
            />
          </View>
        ) : null}
        <Text style={styles.demoNote}>
          Demo barcode for Arc table lamp: 2000000000015
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    height: 40,
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  cameraIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.pale,
    marginBottom: 22,
  },
  title: {
    color: colors.ink,
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  settingsNote: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 20,
  },
  cameraFrame: {
    flex: 1,
    minHeight: 300,
    borderRadius: 24,
    backgroundColor: "#1E241F",
    overflow: "hidden",
  },
  scanGuide: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  scanWindow: {
    width: "78%",
    height: 150,
    borderWidth: 2,
    borderColor: colors.lime,
    borderRadius: 18,
  },
  guideText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 18,
    textShadowColor: "#000000",
    textShadowRadius: 5,
  },
  scanFeedback: {
    gap: 12,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.pale,
    marginTop: 14,
  },
  feedbackText: {
    color: colors.greenDark,
    fontSize: 13,
    lineHeight: 19,
  },
  demoNote: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
  },
});
