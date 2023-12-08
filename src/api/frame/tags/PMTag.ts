export enum PMTag {
	REQ_DATA = '05040000',
	INDEX = '05040001',
	DATA = '05840000',
	REQ_POWER_L1 = '05000001',
	REQ_POWER_L2 = '05000002',
	REQ_POWER_L3 = '05000003',
	REQ_ACTIVE_PHASES = '05000004',
	REQ_MODE = '05000005',
	REQ_ENERGY_L1 = '05000006',
	REQ_ENERGY_L2 = '05000007',
	REQ_ENERGY_L3 = '05000008',
	REQ_DEVICE_ID = '05000009',
	REQ_ERROR_CODE = '0500000A',
	REQ_SET_PHASE_ELIMINATION = '0500000B',
	REQ_GET_PHASE_ELIMINATION = '05000018',
	REQ_FIRMWARE_VERSION = '0500000C',
	REQ_VOLTAGE_L1 = '05000011',
	REQ_VOLTAGE_L2 = '05000012',
	REQ_VOLTAGE_L3 = '05000013',
	REQ_TYPE = '05000014',
	POWER_L1 = '05800001',
	POWER_L2 = '05800002',
	POWER_L3 = '05800003',
	ACTIVE_PHASES = '05800004',
	MODE = '05800005',
	ENERGY_L1 = '05800006',
	ENERGY_L2 = '05800007',
	ENERGY_L3 = '05800008',
	DEVICE_ID = '05800009',
	ERROR_CODE = '0580000A',
	SET_PHASE_ELIMINATION = '0580000B',
	GET_PHASE_ELIMINATION = '05800018',
	FIRMWARE_VERSION = '0580000C',
	VOLTAGE_L1 = '05800011',
	VOLTAGE_L2 = '05800012',
	VOLTAGE_L3 = '05800013',
	TYPE = '05800014',
	CS_START_TIME = '05800051',
	CS_LAST_TIME = '05800052',
	CS_SUCC_FRAMES_ALL = '05800053',
	CS_SUCC_FRAMES_100 = '05800054',
	CS_EXP_FRAMES_ALL = '05800055',
	CS_EXP_FRAMES_100 = '05800056',
	CS_ERR_FRAMES_ALL = '05800057',
	CS_ERR_FRAMES_100 = '05800058',
	CS_UNK_FRAMES = '05800059',
	CS_ERR_FRAME = '0580005A',
	REQ_DEVICE_STATE = '05060000',
	DEVICE_STATE = '05860000',
	DEVICE_CONNECTED = '05860001',
	DEVICE_WORKING = '05860002',
	DEVICE_IN_SERVICE = '05860003',
	GENERAL_ERROR = '05FFFFFF',
}