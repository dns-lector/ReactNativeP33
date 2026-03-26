import { GestureResponderEvent, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import SwipeStyle from "./ui/SwipeStyle"; 
import { useState } from "react";

let eventBegin:GestureResponderEvent|null = null;

export default function Swipe() {
    const {width, height} = useWindowDimensions();
    const shortestSide = Math.min(width, height);
    const fieldSize = 0.96 * shortestSide;
    const [text, setText] = useState<string>("");

    const onGestureBegin = (event: GestureResponderEvent) => {
        /*
        event.nativeEvent.pageX/Y - відлік від меж пристрою (сторінки)
        event.nativeEvent.locationX/Y - від меж блоку-детектора
        */
        eventBegin = event;
    };
    const onGestureEnd = (event: GestureResponderEvent) => {
        if(eventBegin) {
            setText(`dX=${ event.nativeEvent.locationX - eventBegin.nativeEvent.locationX} dY=${event.nativeEvent.locationY - eventBegin.nativeEvent.locationY}` );
        }        
    };
 
    return <View style={{flexDirection: width < height ? "column" : "row", alignItems:"center"}}>
        <Text>Swipe: {text}</Text>
        <TouchableWithoutFeedback onPressIn={onGestureBegin} onPressOut={onGestureEnd}>
            <View style={{width: fieldSize, height: fieldSize, backgroundColor: "#555"}}></View>
        </TouchableWithoutFeedback>
    </View>;
}
/*
Свайп - жест, який складається з послідовності:
-торкання
-проведення
-відпускання
Особливості:
- слід обмежити мінімальну довжину проведення
- ... мінімальну швидкість ...
Питання:
чи буде залежати координатна сітка від орієнтації пристрою?

Д.З. Створити release-збірку застосунку.
Переіменувати результат (АРК)
та викласти файл на загальний доступ (спробувати 
додати як звіт з ДЗ, якщо не прикріплятиметься, то 
дати посилання на ресурс)
*/