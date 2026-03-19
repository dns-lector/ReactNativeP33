import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import RateStyle from "./ui/RateStyle";
import { useEffect, useState } from "react";
import INbuRate from "../../entities/NbuRate/model/INbuRate";
import NbuRateApi from "../../entities/NbuRate/api/NbuRateApi";
import DatePicker from "react-native-date-picker";

export default function Rate() {
    const [rates, setRates] = useState<Array<INbuRate>>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [open, setOpen] = useState(false);

    useEffect(() => {
        NbuRateApi.getCurrentRates().then(setRates);
    }, []);

    return <View style={RateStyle.pageContainer}>

        <View style={RateStyle.pageTitleRow}>
            <TextInput style={RateStyle.search}/>

            <Text style={RateStyle.pageTitle}>Курси НБУ</Text>

            <TouchableOpacity onPress={() => setOpen(true)}>
                <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
        </View>        

        <ScrollView>
            {rates.map((rate, i) => <View key={rate.cc} 
                style={[RateStyle.rateLine, 
                    (i & 1 ? RateStyle.rateLineOdd : RateStyle.rateLineEven)]}>
                <Text style={RateStyle.rateCc}>{rate.cc}</Text>
                <Text style={RateStyle.rateTxt}>{rate.txt}</Text>
                <Text style={RateStyle.rateRate}>{rate.rate}</Text>
            </View>)}
        </ScrollView>

        <DatePicker
            modal
            mode="date"
            open={open}
            date={date}
            onConfirm={(date) => {
                setOpen(false);
                setDate(date);
            }}
            onCancel={() => {
                setOpen(false);
            }}
        />

    </View>;
}
/*
Д.З. Реалізувати відображення курсів валют на 
вибрану дату. Використовувати відповідний АРІ
https://bank.gov.ua/ua/open-data/api-dev
зразок
https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20200302&json
*/