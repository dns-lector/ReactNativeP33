import { GestureResponderEvent, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import SwipeStyle from "./ui/SwipeStyle"; 
import { useState } from "react";

let eventBegin:GestureResponderEvent|null = null;
const minSwipeLength = 100.0;
const minSwipeVelocity = 100.0 / 400.0;   // 100 пікселів за 400 мілісекунд

export default function Swipe() {
    const {width, height} = useWindowDimensions();
    const shortestSide = Math.min(width, height);
    const fieldSize = 0.96 * shortestSide;
    const tileSize = fieldSize / 4.0;
    const [text, setText] = useState<string>("");
    const [field, setField] = useState<Array<number>>(Array.from({ length: 16 }, (_, i) => (3*i + 5) % 16));

    const onSwipeRight = () => {
        let emptyTileIndex = field.findIndex(i => i == 0);
        // свайп праворуч переміщує на порожнє місце ліву від нього тайлу
        // технічно - поміняти місцями елементи масиву field з 
        // індексами emptyTileIndex та emptyTileIndex-1
        // АЛЕ не в усіх позиціях ця дія дозволена: виняток - перший стовпчик (0,4,8,12)
        if(emptyTileIndex % 4 == 0) {
            setText("Рух неможливий");
            return;
        }
        field[emptyTileIndex] = field[emptyTileIndex - 1];
        field[emptyTileIndex - 1] = 0;
        setField([...field]);
    }
     const onSwipeLeft = () => {
        let emptyTileIndex = field.findIndex(i => i == 0);
        // свайп ліворуч переміщує на порожнє місце праву від нього тайлу
        // технічно - поміняти місцями елементи масиву field з 
        // індексами emptyTileIndex та emptyTileIndex+1
        // АЛЕ не в усіх позиціях ця дія дозволена: виняток - останній стовпчик (3,7,11,15)
        if(emptyTileIndex % 4 == 3) {
            setText("Рух неможливий");
            return;
        }
        field[emptyTileIndex] = field[emptyTileIndex + 1];
        field[emptyTileIndex + 1] = 0;
        setField([...field]);
    }


    const onGestureBegin = (event: GestureResponderEvent) => {
        /*
        event.nativeEvent.pageX/Y - відлік від меж пристрою (сторінки)
        event.nativeEvent.locationX/Y - від меж блоку-детектора
        */
        eventBegin = event;
    };
    const onGestureEnd = (event: GestureResponderEvent) => {
        if(eventBegin) {
            const dx = event.nativeEvent.pageX - eventBegin.nativeEvent.pageX;
            const dy = event.nativeEvent.pageY - eventBegin.nativeEvent.pageY;
            const dt = event.nativeEvent.timestamp - eventBegin.nativeEvent.timestamp;
            // є три рішення: жест є горизонтальним, вертикальним або невизначеним (у межах похибок) 
            const lenX = Math.abs(dx);   
            const lenY = Math.abs(dy);
            let result = "";
            if(lenX > 2 * lenY) {
                result = "Horizontal: ";
                // Горизонтальні жести також поділяємо на три варіанти:
                // свайп ліворуч, праворуч або не свайп (закороткий або заповільний)
                if(lenX < minSwipeLength) {
                    result += "too short";
                }
                else if(lenX / dt < minSwipeVelocity) {
                    result += "too slow";
                }
                else if(dx < 0) {
                    onSwipeLeft();
                }
                else {
                    onSwipeRight();
                }
            }
            else if(lenY > 2 * lenX) {
                result = "Vertical: ";
                if(lenY < minSwipeLength) {
                    result += "too short";
                }
                else if(lenY / dt < minSwipeVelocity) {
                    result += "too slow";
                }
                else if(dy < 0) {
                    result += "top";
                }
                else {
                    result += "bottom";
                }
            }
            else {
                result = "Diagonal";
            }
            // setText( `\ndX=${dx}\ndY=${dy}\ndt=${dt}\n${result}` );
            // setText( `${result}` );
        }        
    };

    return <View style={[SwipeStyle.pageContainer, {flexDirection: width < height ? "column" : "row"}]}>
        <Text>Swipe: {text}</Text>
        <TouchableWithoutFeedback onPressIn={onGestureBegin} onPressOut={onGestureEnd}>
            <View style={[SwipeStyle.gameField, {width: fieldSize, height: fieldSize}]}>
                {field.map(i => 
                <View style={[SwipeStyle.tileContainer, {width: tileSize, height: tileSize}]}>
                    {i != 0 && <View style={SwipeStyle.tile}>
                        <Text style={SwipeStyle.tileText}>{i}</Text>
                    </View>} 
                </View>)}
            </View>
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
Перевірка:
сітка також повертається, висновок про горизонтальність 
 прив'язується до реальної (світової) горизонталі

Д.З. Реалізувати анімацію переміщення:
Свайп ліворуч - запуск анімації переміщення - по завершенні змінюємо стан (поле)

*/