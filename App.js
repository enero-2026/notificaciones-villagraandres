import { View, Text, Button } from 'react-native';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const pedirPermiso = async () => {
        await Notifications.requestPermissionsAsync();
    };

    const enviarNotificacion = async (contador) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hola, mundo 🌍",
                body: `El contador actual es: ${contador}`,
            },
            trigger: null, // Este trigger lo puedes modificar para darle unos segundos de delay, ejemplo: trigger{ seconds: 5 }
        });
    };

    const [contador, setContador] = useState(0);
    const [cargado, setCargado] = useState(false);

    useEffect(() => {
        if (cargado) {
            guardarContador(contador);
        }
    }, [contador, cargado]);

    const incrementar = () => {
        setContador(contador + 1);
    };

    const guardarContador = async (valor) => {
        try {
            await AsyncStorage.setItem("contador", JSON.stringify(valor));
        } catch (e) {
            console.log("Error guardando");
        }
    };

    useEffect(() => {
        const cargarContador = async () => {
            try {
                const data = await AsyncStorage.getItem("contador");
                if (data !== null) {
                    setContador(JSON.parse(data));
                }
            } catch (e) {
                console.log("Error cargando");
            } finally {
                setCargado(true);
            }
        };
        cargarContador();
    }, []);

    return (
        <View style={{ marginTop: 50, gap: 10 }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                Notificaciones
            </Text>
            <Button title="Pedir permiso" onPress={pedirPermiso}/>
            <Button title="Enviar notificación" onPress={() => enviarNotificacion(contador)}/>
            <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                Contador: {contador}
            </Text>
            <Button title="Incrementar" onPress={incrementar}/>
        </View>
    );
}