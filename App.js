import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_COUNTER_KEY = 'contador';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [currentCount, setCurrentCount] = useState(0);
    const [isStorageReady, setIsStorageReady] = useState(false);

    const requestNotificationPermission = async () => {
        await Notifications.requestPermissionsAsync();
    };

    const saveCount = async (value) => {
        try {
            await AsyncStorage.setItem(STORAGE_COUNTER_KEY, JSON.stringify(value));
        } catch (error) {
            console.log('Error guardando');
        }
    };

    const sendNotificationWithCount = async (countValue) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Hola, mundo 🌍',
                body: `El contador actual es: ${countValue}`,
            },
            trigger: null, // Este trigger lo puedes modificar para darle unos segundos de delay, ejemplo: trigger{ seconds: 5 }
        });
    };

    const increaseCounter = () => {
        setCurrentCount((previousValue) => previousValue + 1);
    };

    useEffect(() => {
        if (!isStorageReady) {
            return;
        }
        saveCount(currentCount);
    }, [currentCount, isStorageReady]);

    useEffect(() => {
        const loadSavedCount = async () => {
            try {
                const storedValue = await AsyncStorage.getItem(STORAGE_COUNTER_KEY);
                if (storedValue !== null) {
                    setCurrentCount(JSON.parse(storedValue));
                }
            } catch (error) {
                console.log('Error cargando');
            } finally {
                setIsStorageReady(true);
            }
        };
        loadSavedCount();
    }, []);

    return (
        <View style={{ marginTop: 50, gap: 10 }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                Notificaciones
            </Text>
            <Button title="Pedir permiso" onPress={requestNotificationPermission}/>
            <Button title="Enviar notificación" onPress={() => sendNotificationWithCount(currentCount)}/>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                Contador: {currentCount}
            </Text>
            <Button title="Incrementar" onPress={increaseCounter}/>
        </View>
    );
}