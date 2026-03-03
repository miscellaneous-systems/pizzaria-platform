import { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { LoginResponse, User } from "@/types";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextData {
    user: User | null;
    signed: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState<User | null >(null);

    useEffect(() => {
        async function loadData() {
            await loadStorageData();
        }
        loadData();
    }, []);

    async function loadStorageData() {
        try {
            setLoading(true);
            const StoredToken = await AsyncStorage.getItem('@token:pizzaria');
            const StoredUser = await AsyncStorage.getItem('@user:pizzaria');

            if(StoredToken && StoredUser) {
                setUser(JSON.parse(StoredUser));
                setSigned(true);
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao carregar dados do usuário');
        }
        finally {
            setLoading(false);
        }
    }

    async function signIn(email: string, password: string) {

        try {
            const response = await api.post<LoginResponse>('/session', { email, password });

            const {token, ...userData} = response.data;

            await AsyncStorage.setItem('@token:pizzaria', token);
            await AsyncStorage.setItem('@user:pizzaria', JSON.stringify(userData));


            setUser(userData);
        } catch (error: any) {
            throw error;
        }
    }


    async function signOut() {
        await AsyncStorage.removeItem('@token:pizzaria');
        await AsyncStorage.removeItem('@user:pizzaria');
        setUser(null);
    }

    return (
        <AuthContext value={{ signed: !!user, loading, signIn, signOut, user }}>
            {children}
        </AuthContext>
    )
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("Contexto náo foi encontrado!");
    }

    return context;
}