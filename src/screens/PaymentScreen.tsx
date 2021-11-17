import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { STRIPE_API_URL } from "../consts";
import { Button } from "react-native-ui-lib";
import { useStripe } from "@stripe/stripe-react-native";
import PaymentScreenWrapper from "../components/PaymentScreenWrapper";

interface PaymentScreenProps {}

const PaymentScreen: React.FC<PaymentScreenProps> = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();
  // const [loading, setLoadng] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${STRIPE_API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    setClientSecret(paymentIntent);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "The payment was confirmed successfully");
    }
    setPaymentSheetEnabled(false);
  };

  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: "Example Inc.",
      style: "alwaysDark",
    });
    if (!error) {
      setPaymentSheetEnabled(true);
    }
  };

  useEffect(() => {
    // In your app’s checkout, make a network request to the backend and initialize PaymentSheet.
    // To reduce loading time, make this request before the Checkout button is tapped, e.g. when the screen is loaded.
    initialisePaymentSheet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentScreenWrapper>
      <Button
        disabled={!paymentSheetEnabled}
        label="Checkout"
        margin-20
        onPress={openPaymentSheet}
      />
    </PaymentScreenWrapper>
  );
};

export default PaymentScreen;
