export enum WBTag {
	REQ_DATA = '0E040000',
	INDEX = '0E040001',
	DATA = '0E840000',
	REQ_ENERGY_ALL = '0E000001',
	REQ_ENERGY_SOLAR = '0E000002',
	REQ_SOC = '0E000003',
	REQ_STATUS = '0E000004',
	REQ_ERROR_CODE = '0E000005',
	REQ_MODE = '0E000006',
	REQ_APP_SOFTWARE = '0E000007',
	REQ_BOOTLOADER_SOFTWARE = '0E000008',
	REQ_HW_VERSION = '0E000009',
	REQ_FLASH_VERSION = '0E00000A',
	REQ_DEVICE_ID = '0E00000B',
	REQ_DEVICE_STATE = '0E060000',
	REQ_PM_POWER_L1 = '0E00000C',
	REQ_PM_POWER_L2 = '0E00000D',
	REQ_PM_POWER_L3 = '0E00000E',
	REQ_PM_ACTIVE_PHASES = '0E00000F',
	REQ_PM_MODE = '0E000011',
	REQ_PM_ENERGY_L1 = '0E000012',
	REQ_PM_ENERGY_L2 = '0E000013',
	REQ_PM_ENERGY_L3 = '0E000014',
	REQ_PM_DEVICE_ID = '0E000015',
	REQ_PM_ERROR_CODE = '0E000016',
	REQ_PM_DEVICE_STATE = '0E000029',
	REQ_PM_FIRMWARE_VERSION = '0E000017',
	REQ_DIAG_INFOS = '0E00001F',
	REQ_DIAG_WARNINGS = '0E000020',
	REQ_DIAG_ERRORS = '0E000021',
	REQ_DIAG_TEMP_1 = '0E000022',
	REQ_DIAG_TEMP_2 = '0E000023',
	ENERGY_ALL = '0E800001',
	ENERGY_SOLAR = '0E800002',
	SOC = '0E800003',
	STATUS = '0E800004',
	ERROR_CODE = '0E800005',
	MODE = '0E800006',
	APP_SOFTWARE = '0E800007',
	BOOTLOADER_SOFTWARE = '0E800008',
	HW_VERSION = '0E800009',
	FLASH_VERSION = '0E80000A',
	DEVICE_ID = '0E80000B',
	DEVICE_STATE = '0E860000',
	DEVICE_CONNECTED = '0E860001',
	DEVICE_WORKING = '0E860002',
	DEVICE_IN_SERVICE = '0E860003',
	GENERAL_ERROR = '0EFFFFFF',
	PM_POWER_L1 = '0E80000C',
	PM_POWER_L2 = '0E80000D',
	PM_POWER_L3 = '0E80000E',
	PM_ACTIVE_PHASES = '0E80000F',
	PM_MODE = '0E800011',
	PM_ENERGY_L1 = '0E800012',
	PM_ENERGY_L2 = '0E800013',
	PM_ENERGY_L3 = '0E800014',
	PM_DEVICE_ID = '0E800015',
	PM_ERROR_CODE = '0E800016',
	PM_DEVICE_STATE = '0E800029',
	PM_DEVICE_STATE_CONNECTED = '0E800030',
	PM_DEVICE_STATE_WORKING = '0E800031',
	PM_DEVICE_STATE_IN_SERVICE = '0E800032',
	PM_FIRMWARE_VERSION = '0E800017',
	DIAG_INFOS = '0E80001F',
	DIAG_WARNINGS = '0E800020',
	DIAG_ERRORS = '0E800021',
	DIAG_TEMP_1 = '0E800022',
	DIAG_TEMP_2 = '0E800023',
	REQ_AVAILABLE_SOLAR_POWER = '0E041000',
	POWER = '0E041001',
	STATUS_BIT = '0E041002',
	AVAILABLE_SOLAR_POWER = '0E841000',
	REQ_SET_MODE = '0E000030',
	MODE_PARAM_MODE = '0E040031',
	MODE_PARAM_MAX_CURRENT = '0E040032',
	SET_MODE = '0E000031',
	REQ_SET_EXTERN = '0E041010',
	SET_EXTERN = '0E841010',
	EXTERN_DATA = '0E042010',
	EXTERN_DATA_LEN = '0E042011',
	REQ_EXTERN_DATA_SUN = '0E041011',
	REQ_EXTERN_DATA_NET = '0E041012',
	REQ_EXTERN_DATA_ALL = '0E041013',
	REQ_EXTERN_DATA_ALG = '0E041014',
	EXTERN_DATA_SUN = '0E841011',
	EXTERN_DATA_NET = '0E841012',
	EXTERN_DATA_ALL = '0E841013',
	EXTERN_DATA_ALG = '0E841014',
	REQ_SET_BAT_CAPACITY = '0E041015',
	REQ_SET_PARAM_1 = '0E041018',
	REQ_SET_PARAM_2 = '0E041019',
	SET_BAT_CAPACITY = '0E841015',
	SET_PARAM_1 = '0E841018',
	SET_PARAM_2 = '0E841019',
	REQ_PARAM_2 = '0E04101A',
	RSP_PARAM_2 = '0E84101A',
	REQ_PARAM_1 = '0E04101B',
	RSP_PARAM_1 = '0E84101B',
}
