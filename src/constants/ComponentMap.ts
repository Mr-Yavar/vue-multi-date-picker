import MAP_ITEMS from './MapItem'

export const ComponentMap = {
    TIME: {
        TIME: [MAP_ITEMS.TIME],
    },
    MULTI_TIME: {
        TIME: [MAP_ITEMS.TIME],
    },
    ONE_DATE: {
        DAY_AND_TIME: [MAP_ITEMS.DAY_AND_TIME, MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        DAY: [MAP_ITEMS.DAY, MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        MONTH: [MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        YEAR: [MAP_ITEMS.YEAR],
    },
    RANGE_DATE: {
        DAY: [MAP_ITEMS.DAY, MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        MONTH: [MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        YEAR: [MAP_ITEMS.YEAR],
    },
    MULTI_RANGE_DATE: {
        DAY: [MAP_ITEMS.DAY, MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        MONTH: [MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        YEAR: [MAP_ITEMS.YEAR],
    },
    MULTI_DATE: {
        DAY_AND_TIME: [MAP_ITEMS.DAY_AND_TIME, MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        DAY: [MAP_ITEMS.DAY, MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        MONTH: [MAP_ITEMS.MONTH, MAP_ITEMS.YEAR],
        YEAR: [MAP_ITEMS.YEAR],
    },
}
