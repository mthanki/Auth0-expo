import React, { useEffect, useRef } from "react";
import { View } from "react-native-ui-lib";
import {
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPEOUT_DURATION = 150;

interface AnimatedItemContainerProps {
  onSwipeComplete?: () => void;
}

const AnimatedItemContainer: React.FC<AnimatedItemContainerProps> = ({
  onSwipeComplete = () => {},
  children,
}) => {
  useEffect(() => {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }, []);

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: string) => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: {
        x,
        y: 0,
      },
      duration: SWIPEOUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      handleSwipeComplete();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleSwipeComplete = () => {
    onSwipeComplete();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  };

  const handleRenderItem = () => {
    return (
      <Animated.View
        style={[position.getLayout(), styles.container]}
        {...panResponder.panHandlers}
        key={Math.random()}
      >
        {children}
      </Animated.View>
    );
  };

  return <View>{handleRenderItem()}</View>;
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
});

export default AnimatedItemContainer;
