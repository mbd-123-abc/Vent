//Mahika Bagri
//26 April 2026

import React, { useRef } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Animated, 
  PanResponder, 
  Dimensions, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

const { width } = Dimensions.get('window');

interface User {
  bio: string;
  tags: string[];
}

interface MatchCardProps {
  user: User;
}

const MatchCard: React.FC<MatchCardProps> = ({ user }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > 120) {
          Animated.timing(pan, {
            toValue: { x: gestureState.dx > 0 ? 500 : -500, y: gestureState.dy },
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return (
    <View style={styles.screenContainer}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate: rotate }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.cardInner}>
          <Text style={styles.bio}>{user.bio}</Text>
          <Text style={styles.tags}>{user.tags.join(' • ')}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

interface Styles {
  screenContainer: ViewStyle;
  card: ViewStyle;
  cardInner: ViewStyle;
  tags: TextStyle;
  bio: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: 500,
    borderRadius: 20,
    
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: -90,
  },
  cardInner: {
    padding: 20,
    alignItems: 'center',
  },
  tags: {
    fontSize: 15,
    color: '#8730de', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#000000', 
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 15,
  },
});

export default MatchCard;