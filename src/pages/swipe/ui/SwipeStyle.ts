import { StyleSheet } from "react-native";
import Colors from "../../../features/config/Colors";

const SwipeStyle = StyleSheet.create({
    pageContainer: {
        alignItems:"center",
    },
    gameField: {
        backgroundColor: "#555",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: "space-between",
    },
    tileContainer: {
        alignItems: "stretch",
        justifyContent: "space-between",
    },
    tile: {
        flex: 1,
        backgroundColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        margin: 2.0,
    },
    tileText: {
        color: Colors.primaryTextColor,
        fontSize: 30.0,
    },
    tileTextInPlace: {
        color: Colors.successTextColor,
        fontSize: 32.0,
    },
    difficultyContainer: {
        // marginVertical: 10.0,
    },
    difficultySelector: {
        backgroundColor: "#555",
    },
    difficultyItem: {
        flex: 1,
        backgroundColor: "#454545ff",
        alignItems: "center",
        justifyContent: "center",
        margin: 2.0,
        opacity: 0.5,
    },
    difficultyItemSelected: {
        flex: 1,
        backgroundColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        margin: 2.0,
    }
});

export default SwipeStyle;
