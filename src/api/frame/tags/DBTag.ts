export enum DBTag {
	REQ_HISTORY_DATA_DAY = '06000100',
	REQ_HISTORY_TIME_START = '06000101',
	REQ_HISTORY_TIME_INTERVAL = '06000102',
	REQ_HISTORY_TIME_SPAN = '06000103',
	REQ_HISTORY_DATA_WEEK = '06000200',
	REQ_HISTORY_DATA_MONTH = '06000300',
	REQ_HISTORY_DATA_YEAR = '06000400',
	SUM_CONTAINER = '06800010',
	VALUE_CONTAINER = '06800020',
	GRAPH_INDEX = '06800001',
	BAT_POWER_IN = '06800002',
	BAT_POWER_OUT = '06800003',
	DC_POWER = '06800004',
	GRID_POWER_IN = '06800005',
	GRID_POWER_OUT = '06800006',
	CONSUMPTION = '06800007',
	PM_0_POWER = '06800008',
	PM_1_POWER = '06800009',
	BAT_CHARGE_LEVEL = '0680000A',
	BAT_CYCLE_COUNT = '0680000B',
	CONSUMED_PRODUCTION = '0680000C',
	AUTARKY = '0680000D',
	HISTORY_DATA_DAY = '06800100',
	HISTORY_DATA_WEEK = '06800200',
	HISTORY_DATA_MONTH = '06800300',
	HISTORY_DATA_YEAR = '06800400',
	PAR_TIME_MIN = '06B00000',
	PAR_TIME_MAX = '06B00001',
	PARAM_ROW = '06B00002',
	PARAM_COLUMN = '06B00003',
	PARAM_INDEX = '06B00004',
	PARAM_VALUE = '06B00005',
	PARAM_MAX_ROWS = '06B00006',
	PARAM_TIME = '06B00007',
	PARAM_VERSION = '06B00008',
	PARAM_HEADER = '06B00009',
	REQ_SYNC_HIST = '06000500',
	REQ_VACUUM_HIST = '06000501',
	REQ_SYNC_BPU = '06000502',
	REQ_VACUUM_BPU = '06000503',
	REQ_SYNC_DCB = '06000504',
	REQ_VACUUM_DBC = '06000505',
	REQ_SYNC_BPU_CONF = '06000506',
	REQ_VACUUM_BPU_CONF = '06000507',
	REQ_SYNC_DCB_CONF = '06000508',
	REQ_VACUUM_DBC_CONF = '06000509',
	REQ_SYNC_WALLBOX = '0600050A',
	REQ_VACUUM_WALLBOX = '0600050B',
	REQ_SYNC_PV_DEBUG = '0600050C',
	REQ_VACUUM_PV_DEBUG = '0600050D',
	REQ_VACUUM_CONFIG = '0600050F',
	REQ_SET_SYNC_TIME = '06000510',
	SYNC_HIST = '06800500',
	VACUUM_HIST = '06800501',
	SYNC_BPU = '06800502',
	VACUUM_BPU = '06800503',
	SYNC_DCB = '06800504',
	VACUUM_DCB = '06800505',
	SYNC_BPU_CONF = '06800506',
	VACUUM_BPU_CONF = '06800507',
	SYNC_DCB_CONF = '06800508',
	VACUUM_DCB_CONF = '06800509',
	SYNC_WALLBOX = '0680050A',
	VACUUM_WALLBOX = '0680050B',
	SYNC_PV_DEBUG = '0680050C',
	VACUUM_PV_DEBUG = '0680050D',
	SYNC_CONFIG = '0680050E',
	VACUUM_CONFIG = '0680050F',
	SET_SYNC_TIME = '06800510',
}
