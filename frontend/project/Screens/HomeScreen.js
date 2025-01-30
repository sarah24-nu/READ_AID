import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        OpenDyslexic: require('../assets/fonts/OpenDyslexic-Regular.otf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
// Function to handle navigation and pass level number
const navigateToLevel = (levelNumber) => {
  navigation.navigate(`Screen1`, { level: levelNumber });
};
  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerText}>Hey, Welcome!</Text>
          <Text style={styles.headerSubtitle}>Let's Play!</Text>
        </View>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v12345678/levels_imgs/ksvjfqzry3jq8uel3q58',
          }}
          style={styles.levelImage}
          />
      </View>

      {/* Levels */}
      <ScrollView contentContainerStyle={styles.levelsContainer}>
        {/* Level 0 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFCDD2' }]}
          onPress={() => navigateToLevel(0)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 0</Text>
              <Text style={styles.levelSubtitle}>Alphabet Adventure</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v12345678/levels_imgs/llpqyqmlar5s1kxu0p25',
          }}
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 1 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#BBDEFB' }]}
          onPress={() => navigateToLevel(1)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 1</Text>
              <Text style={styles.levelSubtitle}>Sh-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v12345678/levels_imgs/dpghjuhufunivduerqni',
          }}
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 2 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#C8E6C9' }]}
          onPress={() => navigateToLevel(2)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 2</Text>
              <Text style={styles.levelSubtitle}>Th-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v12345678/levels_imgs/ems3xpfnbbg6kfmdgaqv',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 3 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(3)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 3</Text>
              <Text style={styles.levelSubtitle}>Ch-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v12345678/levels_imgs/d9nd9wk9wusg3ucrhefc',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 4 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(4)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 4</Text>
              <Text style={styles.levelSubtitle}>-unk</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737607318/skunk_dnhoke.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 5 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(5)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 5</Text>
              <Text style={styles.levelSubtitle}>-ink</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608379/ink_vjrkbs.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 6 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(6)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 6</Text>
              <Text style={styles.levelSubtitle}>-ing</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608380/king_ttbvbb.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 7 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(7)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 7</Text>
              <Text style={styles.levelSubtitle}>-ay</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608380/play_vrf1qn.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 8 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(8)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 8</Text>
              <Text style={styles.levelSubtitle}>-ai</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608381/train_lbafij.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 9 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(9)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 9</Text>
              <Text style={styles.levelSubtitle}>-ee-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608381/tree_xff95g.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 10 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(10)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 10</Text>
              <Text style={styles.levelSubtitle}>-ea-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608380/read_qyaqgf.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 11 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(11)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 11</Text>
              <Text style={styles.levelSubtitle}>-oa-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608379/boat_w97xbk.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 12 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(12)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 12</Text>
              <Text style={styles.levelSubtitle}>Bossy E</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608380/snake_prmviv.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 13 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(13)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 13</Text>
              <Text style={styles.levelSubtitle}>Vowel Walk</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608380/pie_qrmxtm.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>

        {/* Level 14 */}
        <TouchableOpacity
          style={[styles.levelCard, { backgroundColor: '#FFECB3' }]}
          onPress={() => navigateToLevel(14)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.levelTitle}>Level 14</Text>
              <Text style={styles.levelSubtitle}>-00-</Text>
            </View>
            <Image
          source={{
            uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v1737608381/school_yzjhqg.png',
          }
          }
          style={styles.levelImage}
          />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.footerButton}
        >
          <Icon name="home-outline" size={20} color="#000" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          style={styles.footerButton}
        >
          <Icon name="person-outline" size={20} color="#000" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E7FF',
  },
  headerCard: {
    backgroundColor: '#FFE082',
    borderRadius: 20,
    padding: 22,
    paddingVertical:40,
    marginHorizontal: 10,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic',
    color: '#000',
   
  },
  headerSubtitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic',
    color: '#555',
    marginTop: 5,
  },
  headerImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  levelsContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 30,
  },
  levelCard: {
    borderRadius: 20,
    marginBottom: 20,
    height: 140,
    justifyContent: 'center',
    paddingHorizontal: 20,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 22,
    fontFamily: 'OpenDyslexic',
    color: '#000',
  },
  levelSubtitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic',
    color: '#444',
    marginTop: 5,
  },
  levelImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 2,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#F1E7FF',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic',
    color: '#000',
    marginTop: 5,
  },
});

export default HomeScreen;
