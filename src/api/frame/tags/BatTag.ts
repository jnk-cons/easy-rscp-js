export enum BatTag {
	REQ_DATA = '03040000',
	INDEX = '03040001',
	DATA = '03840000',
	RSOC = '03800001',
	MODULE_VOLTAGE = '03800002',
	CURRENT = '03800003',
	MAX_BAT_VOLTAGE = '03800004',
	MAX_CHARGE_CURRENT = '03800005',
	EOD_VOLTAGE = '03800006',
	MAX_DISCHARGE_CURRENT = '03800007',
	CHARGE_CYCLES = '03800008',
	TERMINAL_VOLTAGE = '03800009',
	STATUS_CODE = '0380000A',
	ERROR_CODE = '0380000B',
	DEVICE_NAME = '0380000C',
	DCB_COUNT = '0380000D',
	MAX_DCB_CELL_TEMPERATURE = '03800016',
	MIN_DCB_CELL_TEMPERATURE = '03800017',
	DCB_CELL_TEMPERATURE = '03800019',
	DCB_CELL_VOLTAGE = '0380001B',
	READY_FOR_SHUTDOWN = '0380001E',
	INFO = '03800020',
	TRAINING_MODE = '03800021',
	REQ_RSOC = '03000001',
	REQ_MODULE_VOLTAGE = '03000002',
	REQ_CURRENT = '03000003',
	REQ_MAX_BAT_VOLTAGE = '03000004',
	REQ_MAX_CHARGE_CURRENT = '03000005',
	REQ_EOD_VOLTAGE = '03000006',
	REQ_MAX_DISCHARGE_CURRENT = '03000007',
	REQ_CHARGE_CYCLES = '03000008',
	REQ_TERMINAL_VOLTAGE = '03000009',
	REQ_STATUS_CODE = '0300000A',
	REQ_ERROR_CODE = '0300000B',
	REQ_DEVICE_NAME = '0300000C',
	REQ_DCB_COUNT = '0300000D',
	REQ_MAX_DCB_CELL_TEMPERATURE = '03000016',
	REQ_MIN_DCB_CELL_TEMPERATURE = '03000017',
	REQ_READY_FOR_SHUTDOWN = '0300001E',
	REQ_INFO = '03000020',
	REQ_TRAINING_MODE = '03000021',
	DCB_INDEX = '03800100',
	DCB_LAST_MESSAGE_TIMESTAMP = '03800101',
	DCB_MAX_CHARGE_VOLTAGE = '03800102',
	DCB_MAX_CHARGE_CURRENT = '03800103',
	DCB_END_OF_DISCHARGE = '03800104',
	DCB_MAX_DISCHARGE_CURRENT = '03800105',
	DCB_FULL_CHARGE_CAPACITY = '03800106',
	DCB_REMAINING_CAPACITY = '03800107',
	DCB_SOC = '03800108',
	DCB_SOH = '03800109',
	DCB_CYCLE_COUNT = '03800110',
	DCB_CURRENT = '03800111',
	DCB_VOLTAGE = '03800112',
	DCB_CURRENT_AVG_30S = '03800113',
	DCB_VOLTAGE_AVG_30S = '03800114',
	DCB_DESIGN_CAPACITY = '03800115',
	DCB_DESIGN_VOLTAGE = '03800116',
	DCB_CHARGE_LOW_TEMPERATURE = '03800117',
	DCB_CHARGE_HIGH_TEMPERATURE = '03800118',
	DCB_MANUFACTURE_DATE = '03800119',
	DCB_SERIALNO = '03800120',
	DCB_PROTOCOL_VERSION = '03800121',
	DCB_FW_VERSION = '03800122',
	DCB_DATA_TABLE_VERSION = '03800123',
	DCB_PCB_VERSION = '03800124',
	REQ_DEVICE_STATE = '03060000',
	DEVICE_STATE = '03860000',
	DEVICE_CONNECTED = '03860001',
	DEVICE_WORKING = '03860002',
	DEVICE_IN_SERVICE = '03860003',
	GENERAL_ERROR = '03FFFFFF',
}
