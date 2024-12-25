import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard, { EventCardType } from '../components/EventCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '../store';

const Home = () => {
  const [events, setEvents] = useState<EventCardType[]>([]);
  const { itemsSelected } = useCartStore();

  const fetchEvents = async () => {
    try {
      const fetchedEvents: EventCardType[] = [];
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=Ea22dJTWaht44gXjhEqBrmzQ5lEqcXAX');
      if (response.data?._embedded?.events) {
        response.data._embedded.events.forEach((event: any) => {
          fetchedEvents.push({
            name: event.name,
            date: event.dates.start.localDate,
            image: event.images[0].url,
            price: event.priceRanges ? event.priceRanges[0].min : 0,
          });
        });
        setEvents(fetchedEvents);
        console.log('events:', events);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCartPress = () => {
    console.log('Cart pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {events.map((event, index) => (
          <EventCard 
            key={index}
            name={event.name}
            date={event.date}
            image={event.image}
            price={event.price}
            incrementItemsSelected={useCartStore.getState().incrementItems}
          />
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleCartPress}
      >
        <Feather name="shopping-cart" size={24} color="white" />
        <Text style={{ color: 'white', marginLeft: 5 }}>{itemsSelected}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2ecc71',
    width: 76,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row', // Added to keep child elements in one row
  },
});

export default Home;
