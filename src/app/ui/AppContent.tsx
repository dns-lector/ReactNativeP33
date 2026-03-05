import { Text, TouchableOpacity, View } from "react-native";
import AppContentStyle from "./AppContentStyle";
import Home from "../../pages/home/Home";
import { useState } from "react";
import IRoute from "../../features/model/IRoute";
import Calc from "../../pages/calc/Calc";

const startPage:IRoute = {
    slug: 'home',
};

export default function AppContent() {
    const [history, setHistory] = useState<Array<IRoute>>([]);
    const [page, setPage] = useState<IRoute>(startPage);

    const navigate = (route:IRoute):void => {
        if(route.slug != page.slug) {
            // Перехід на нову сторінку - збереження поточної
            // сторінки в історії та зміна поточної сторінки
            setHistory([...history, page]);
            setPage(route);
        }
    };

    return <View style={AppContentStyle.container}>
        <View style={AppContentStyle.topBar}>
            <View style={AppContentStyle.topBarIcon}></View>
            <Text style={AppContentStyle.topBarTitle}>Mobile-P33</Text>
            <View style={AppContentStyle.topBarIcon}></View>
        </View>

        <View style={AppContentStyle.pageWidget}>
            { page.slug == "home" ? <Home />
            : page.slug == "calc" ? <Calc />
            : <Text>Not Found</Text>
            }
        </View>        

        <View style={AppContentStyle.bottomBar}>
            <TouchableOpacity onPress={() => navigate({slug: 'home'})}>
                <View style={AppContentStyle.bottomBarIcon}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate({slug: 'calc'})}>
                <View style={AppContentStyle.bottomBarIcon}></View>
            </TouchableOpacity>
            <View style={AppContentStyle.bottomBarIcon}></View>
            <View style={AppContentStyle.bottomBarIcon}></View>
            <View style={AppContentStyle.bottomBarIcon}></View>
        </View>
    </View>;
}