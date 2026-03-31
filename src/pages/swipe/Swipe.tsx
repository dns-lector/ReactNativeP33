import { GestureResponderEvent, Pressable, Text, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import SwipeStyle from "./ui/SwipeStyle"; 
import { ReactNode, useRef, useState } from "react";
import { MoveDirection } from "./model/MoveDirection";

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
    const [difficulty, setDifficulty] = useState<number>(1);

    // #region gesture detection
    const makeMove = (direction:MoveDirection) => {
        let emptyTileIndex = field.findIndex(i => i == 0);
        let otherTileIndex;
        switch(direction) {
            case MoveDirection.right :
                otherTileIndex = emptyTileIndex % 4 == 0 ? -1 : emptyTileIndex - 1;
                break;
            case MoveDirection.left :
                otherTileIndex = emptyTileIndex % 4 == 3 ? -1 : emptyTileIndex + 1;
                break;
            case MoveDirection.up :
                otherTileIndex = emptyTileIndex >= 12 ? -1 : emptyTileIndex + 4;
                break;
            case MoveDirection.down :
                otherTileIndex = emptyTileIndex < 4 ? -1 : emptyTileIndex - 4;
                break;
        }
        if(otherTileIndex == -1) {
            setText("Рух неможливий");
        }
        else {
            field[emptyTileIndex] = field[otherTileIndex];
            field[otherTileIndex] = 0;
            setField([...field]);
        }
    };

    const onSwipeRight = () => makeMove(MoveDirection.right);
    const onSwipeLeft = () =>  makeMove(MoveDirection.left);
    const onSwipeTop = () =>  makeMove(MoveDirection.up);
    const onSwipeBottom = () =>  makeMove(MoveDirection.down);


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
            if(lenX > 2 * lenY) {
                // Горизонтальні жести також поділяємо на три варіанти:
                // свайп ліворуч, праворуч або не свайп (закороткий або заповільний)
                if(lenX < minSwipeLength) {
                    setText("too short");
                }
                else if(lenX / dt < minSwipeVelocity) {
                    setText("too slow");
                }
                else if(dx < 0) {
                    onSwipeLeft();
                }
                else {
                    onSwipeRight();
                }
            }
            else if(lenY > 2 * lenX) {
                if(lenY < minSwipeLength) {
                    setText("too short");
                }
                else if(lenY / dt < minSwipeVelocity) {
                    setText("too slow");
                }
                else if(dy < 0) {
                    onSwipeTop();
                }
                else {
                    onSwipeBottom();
                }
            }
            else {
                setText("Diagonal");
            }
            // setText( `\ndX=${dx}\ndY=${dy}\ndt=${dt}\n${result}` );
        }        
    };
    // #endregion
    
    const isPortrait = width < height;

    return <View style={[SwipeStyle.pageContainer, {flexDirection: isPortrait ? "column" : "row"}]}>
        <Text>Swipe: {text}</Text>

        <TouchableWithoutFeedback onPressIn={onGestureBegin} onPressOut={onGestureEnd}>
            <View style={[SwipeStyle.gameField, {width: fieldSize, height: fieldSize}]}>
                {field.map(i => 
                <View key={i} style={[SwipeStyle.tileContainer, {width: tileSize, height: tileSize}]}>
                    {i != 0 && <View style={SwipeStyle.tile}>
                        <Text style={true ? SwipeStyle.tileTextInPlace : SwipeStyle.tileText}>{i}</Text>
                    </View>} 
                </View>)}
            </View>
        </TouchableWithoutFeedback>

        <View style={[SwipeStyle.difficultyContainer, {
            marginTop: isPortrait ? 40.0 : 0,
            marginLeft: isPortrait ? 0 : 40.0,
        }]}>
            <View style={[SwipeStyle.difficultySelector, {
                flexDirection:isPortrait ? "row" : "column",
                height:  isPortrait ? tileSize : fieldSize,
                width: isPortrait ? fieldSize : tileSize,
            }]}>
                <Pressable onPress={() => setDifficulty(1)} style={[difficulty == 1 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>                   
                    <Text style={SwipeStyle.tileText}>1</Text>                   
                </Pressable>

                <Pressable onPress={() => setDifficulty(2)} style={[difficulty == 2 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>                  
                    <Text style={SwipeStyle.tileText}>2</Text>
                </Pressable>

                <Pressable onPress={() => setDifficulty(3)} style={[difficulty == 3 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>
                    <Text style={SwipeStyle.tileText}>3</Text>
                </Pressable>

                <Pressable onPress={() => setDifficulty(4)} style={[difficulty == 4 ? SwipeStyle.difficultyItemSelected : SwipeStyle.difficultyItem]}>
                    <Text style={SwipeStyle.tileText}>4</Text> 
                </Pressable>
            </View>
        </View>

        <Swipeable onSwipeRight={onSwipeRight} >
            <View></View>
        </Swipeable>
    </View>;
}


function Swipeable(
    {onSwipeRight, onSwipeLeft, onSwipeTop, onSwipeBottom, onUrecognized, children}: 
    {onSwipeRight?:()=>void, 
        onSwipeLeft?:()=>void, 
        onSwipeTop?:()=>void, 
        onSwipeBottom?:()=>void,
        onUrecognized?:(reason:string)=>void,
    children: ReactNode}) {
        const eventBegin = useRef<GestureResponderEvent|null>(null);

        const onGestureBegin = (event: GestureResponderEvent) => {
            /*
            event.nativeEvent.pageX/Y - відлік від меж пристрою (сторінки)
            event.nativeEvent.locationX/Y - від меж блоку-детектора
            */
            eventBegin.current = event;
        };
        const onGestureEnd = (event: GestureResponderEvent) => {
            const e1 = eventBegin.current;
            if(e1) {                
                const dx = event.nativeEvent.pageX - e1.nativeEvent.pageX;
                const dy = event.nativeEvent.pageY - e1.nativeEvent.pageY;
                const dt = event.nativeEvent.timestamp - e1.nativeEvent.timestamp;
                // є три рішення: жест є горизонтальним, вертикальним або невизначеним (у межах похибок) 
                const lenX = Math.abs(dx);   
                const lenY = Math.abs(dy);
                if(lenX > 2 * lenY) {
                    // Горизонтальні жести також поділяємо на три варіанти:
                    // свайп ліворуч, праворуч або не свайп (закороткий або заповільний)
                    if(lenX < minSwipeLength) {
                        if(onUrecognized) onUrecognized("Horizontal: too short");
                    }
                    else if(lenX / dt < minSwipeVelocity) {
                        if(onUrecognized) onUrecognized("Horizontal: too slow");
                    }
                    else if(dx < 0) {
                        if(onSwipeLeft) onSwipeLeft();
                    }
                    else {
                        if(onSwipeRight) onSwipeRight();
                    }
                }
                else if(lenY > 2 * lenX) {
                    if(lenY < minSwipeLength) {
                        if(onUrecognized) onUrecognized("Vertical: too short");
                    }
                    else if(lenY / dt < minSwipeVelocity) {
                        if(onUrecognized) onUrecognized("Vertical: too slow");
                    }
                    else if(dy < 0) {
                        if(onSwipeTop) onSwipeTop();
                    }
                    else {
                        if(onSwipeBottom) onSwipeBottom();
                    }
                }
                else {
                    if(onUrecognized) onUrecognized("Diagonal");
                }
            }        
        };
    return <TouchableWithoutFeedback onPressIn={onGestureBegin} onPressOut={onGestureEnd}>
        {children}
    </TouchableWithoutFeedback>;
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
На всі види свайпів - переміщень

*/