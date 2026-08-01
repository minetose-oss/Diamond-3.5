import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line, Treemap,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Target, Award, MapPin, Users, BarChart2, Trophy } from "lucide-react";

// ─── RAW VOLUME DATA ─────────────────────────────────────────────────────────

const RAW: Record<string, Record<string, number>> = {
  // ── ปี 2568 (2025) ──
  apr25: {
    "2_8654":43_981_351.44,"8660":30_083_676.95,"4_8616":28_000_000,"3_8653":22_096_558.46,
    "4_8649":20_000_000,"5_8637":16_300_841.47,"1_8658":16_079_626.02,"4_8648":13_253_081.28,
    "2_8651":12_566_408.04,"5_8644":11_950_000,"4_8611":10_008_000,"2_8619":9_228_222.82,
    "1_8656":8_938_983.30,"3_8652":8_131_992.17,"5_8645":7_989_485.51,"5_8634":6_900_699.92,
    "5_8640":6_670_000,"5_8643":6_601_076.20,"6_8620":6_000_000,"5_8628":5_850_000,
    "5_8632":5_014_246.14,"2_8617":4_866_695.76,"5_8630":4_255_000,"5_8629":4_200_000,
    "5_8633":3_800_000,"5_8638":3_512_225.25,"5_8639":3_271_020.11,"3_8621":3_070_000,
    "5_8610":3_000_000,"5_8635":2_003_000,"1_8624":1_835_632.31,"5_8631":1_475_000,
    "3_8650":1_186_848.73,"1_8647":1_000_000,
  },
  may25: {
    "4_8649":52_020_000,"4_8616":42_504_141.15,"2_8654":41_684_960.91,"3_8653":28_863_111.55,
    "1_8658":26_006_521.67,"1_8647":25_802_776.75,"4_8648":24_158_854.20,"5_8644":16_703_137.76,
    "8660":16_105_284.21,"2_8651":14_495_153.65,"5_8640":11_480_000,"2_8619":11_297_990.38,
    "6_8620":11_224_723.59,"6_8622":11_217_249.16,"1_8656":11_006_011.02,"4_8611":10_231_332.37,
    "5_8634":8_667_315.21,"3_8652":8_589_152.51,"5_8643":8_500_000,"2_8617":8_338_097.75,
    "5_8632":7_745_005.48,"5_8637":7_000_000,"5_8630":6_820_652.79,"5_8645":6_646_000,
    "1_8589":5_100_000,"4_8612":5_099_541.21,"5_8635":5_000_000,"3_8621":4_580_034.59,
    "5_8638":4_062_861.70,"5_8636":4_000_112.70,"5_8628":3_800_000,"1_8624":3_729_808.06,
    "5_8629":3_053_000,"5_8590":2_876_697,"5_8633":2_050_580.84,"5_8639":1_700_000,
    "3_8650":1_407_510.43,"5_8610":1_339_000,"5_8631":75_000,
  },
  jun25: {
    "4_8649":100_044_904.48,"2_8654":72_223_686.13,"4_8616":53_395_490.96,"1_8647":51_095_162.65,
    "8660":41_083_162.10,"1_8658":23_918_652.74,"3_8653":23_763_413.46,"6_8622":19_370_000,
    "4_8648":19_100_000,"5_8644":18_839_242.16,"2_8651":16_776_881.45,"4_8611":14_967_966.82,
    "5_8585":14_150_000,"5_8637":13_906_468.59,"2_8619":12_604_848.44,"5_8640":10_800_000,
    "5_8643":10_000_000,"3_8652":8_960_052.17,"5_8639":8_860_564.22,"5_8628":8_670_000,
    "5_8645":8_549_578.04,"1_8656":8_295_342.21,"2_8617":8_018_108.10,"6_8620":6_000_000,
    "5_8630":5_802_068.14,"1_8589":5_800_000,"1_8624":5_420_559.06,"5_8629":5_134_775.34,
    "5_8632":4_319_173.01,"3_8621":4_200_000,"4_8577":3_500_000,"4_8612":3_451_926.39,
    "5_8634":3_400_000,"3_8650":3_365_228.66,"5_8638":3_033_183.42,"5_8636":3_000_000,
    "5_8635":3_000_000,"5_8610":2_700_000,"5_8631":2_010_926.09,"5_8633":2_000_000,
    "5_8590":834_251,
  },
  jul25: {
    "4_8649":173_040_000,"1_8570":60_199_977.67,"4_8616":51_607_235.78,"2_8654":42_045_643.54,
    "5_8644":33_160_458.27,"8660":32_003_126.46,"3_8653":31_860_221.06,"4_8648":31_700_000,
    "1_8576":27_318_050.33,"5_8643":21_702_000,"6_8622":21_274_223.35,"5_8639":18_498_667.20,
    "5_8585":18_420_000,"4_8611":17_055_439.61,"5_8637":16_100_000,"2_8651":12_647_567.34,
    "2_8617":11_317_327.51,"6_8620":11_291_257.52,"5_8640":9_590_000,"3_8652":8_845_834.67,
    "1_8647":7_899_989.06,"2_8619":7_845_555.72,"5_8629":7_516_000,"5_8645":7_000_000,
    "5_8634":6_700_000,"5_8590":6_590_562,"4_8577":6_388_894.73,"1_8589":6_250_000,
    "5_8630":5_759_000,"5_8636":4_971_463.27,"5_8628":4_400_000,"5_8632":4_400_000,
    "3_8621":4_144_178.55,"1_8624":3_961_408.40,"5_8633":3_800_000,"5_8610":3_800_000,
    "3_8650":3_506_532.07,"4_8612":2_600_533.64,"5_8638":2_000_000,"5_8631":1_864_394.55,
    "5_8635":1_000_000,
  },
  aug25: {
    "4_8649":120_502_758.24,"2_8654":61_093_887.12,"8660":50_116_852.14,"7_8616":36_720_396.20,
    "5_8637":34_107_446.10,"2_8651":33_979_316.36,"1_8658":33_611_260.26,"5_8644":31_270_718.90,
    "1_8570":28_537_828.32,"7_8648":28_200_000,"3_8653":25_186_536.92,"6_8622":22_850_000,
    "5_8585":19_000_000,"5_8639":16_357_969.18,"5_8640":13_100_000,"3_8652":11_442_852.73,
    "2_8619":11_323_253.63,"4_8611":11_068_377.96,"6_8620":10_000_000,"5_8643":9_800_000,
    "1_8656":9_473_371.48,"1_8576":7_426_376.04,"4_8577":6_481_375.29,"5_8628":6_300_000,
    "1_8589":6_000_000,"5_8629":5_795_000,"1_8647":5_675_171.32,"5_8630":5_650_000,
    "2_8617":5_548_073.20,"5_8645":5_201_000,"3_8650":5_115_057.04,"5_8635":5_000_000,
    "3_8621":4_847_673.97,"5_8566":4_700_000,"5_8632":4_342_593.01,"5_8633":4_002_000,
    "5_8610":4_000_000,"1_8624":3_635_646,"4_8612":3_200_064.91,"5_8636":3_100_000,
    "5_8638":2_005_619.40,"5_8634":1_800_000,"5_8631":1_520_286.90,"5_8567":1_355_000,
    "5_8590":1_280_000,
  },
  sep25: {
    "4_8649":217_050_000,"8660":105_718_868.19,"2_8654":105_313_802.91,"7_8616":101_461_082.78,
    "1_8570":97_071_039.27,"1_8576":89_220_000,"1_8658":84_688_335.56,"6_8622":59_138_853.32,
    "7_8648":50_150_000,"5_8637":44_945_602.19,"3_8653":36_764_466.68,"5_8644":35_510_418.01,
    "5_8639":25_838_284.71,"5_8643":25_500_000,"2_8651":22_931_098.65,"6_8620":20_210_990.22,
    "5_8640":17_220_000,"5_8585":15_550_000,"1_8624":15_496_231.14,"2_8617":14_787_917.02,
    "5_8628":14_400_000,"2_8619":14_104_109.19,"4_8611":12_107_299.23,"4_8577":11_847_260.33,
    "5_8629":11_415_266.99,"1_8647":10_851_589.03,"5_8566":10_730_000,"5_8630":9_579_999,
    "3_8652":9_563_168.51,"3_8621":9_402_194.87,"1_8656":9_224_727.72,"5_8634":8_000_000,
    "5_8590":7_004_000,"5_8610":6_600_000,"3_8650":6_516_259.67,"1_8589":6_000_000,
    "5_8636":5_200_000,"5_8645":5_200_000,"5_8632":4_411_351.14,"5_8633":4_000_000,
    "5_8567":3_505_000,"5_8635":3_000_000,"5_8638":3_000_000,"4_8612":2_582_831.21,
    "5_8562":2_010_000,"5_8631":1_537_101.36,"7_A001":1_300_000,"5_A057":40_000,"7_A056":10_000,
  },
  oct25: {
    "4_8649":311_095_000,"7_8616":125_695_803.96,"6_8622":110_145_761.82,"8660":106_121_763.47,
    "2_8654":82_094_937.12,"7_8648":67_800_000,"1_8570":57_286_072.57,"5_8637":52_752_000,
    "4_8611":51_142_633.68,"5_8639":47_578_802.09,"3_8653":46_237_480.50,"5_8644":45_894_026.54,
    "1_8576":43_677_950.01,"5_8585":33_350_000,"5_8643":33_000_000,"6_8620":31_278_108,
    "1_8658":29_367_010.57,"5_8640":28_500_000,"5_8630":26_110_000,"5_8628":25_170_100,
    "5_8567":18_215_000,"5_8566":17_250_000,"1_8624":16_603_626.34,"1_8656":15_760_000,
    "3_8621":15_391_600.08,"4_8577":14_384_556.06,"5_8636":13_250_000,"3_8652":13_054_756.67,
    "1_8647":11_986_367.01,"2_8619":11_900_000,"5_8634":9_900_000,"5_8629":9_640_000,
    "3_8650":9_598_184.58,"5_8590":9_111_000,"5_8633":7_500_000,"2_8617":7_408_886.61,
    "4_8612":5_078_213.76,"1_8589":5_000_000,"5_8645":4_971_120.66,"5_8632":4_679_835.97,
    "5_8610":3_600_000,"5_8631":2_598_025.53,"5_8638":2_500_000,"5_8635":2_000_000,
    "7_A001":1_972_138.39,"5_A057":1_200_000,"5_8562":1_000_000,"2_8553":1_000_000,
    "7_A056":40_000,
  },
  nov25: {
    "4_8649":102_000_000,"6_8622":46_244_356.87,"2_8654":40_050_733.30,"7_8616":35_265_000,
    "1_8570":32_643_543.69,"8660":31_497_025.01,"5_8637":25_000_000,"1_8576":24_306_242.08,
    "5_8639":23_356_055.78,"5_8585":22_350_000,"1_8658":21_741_902.15,"3_8653":20_494_561.52,
    "6_8620":20_000_000,"5_8640":18_600_000,"7_8648":17_316_265.21,"5_8643":12_700_000,
    "5_8644":11_423_669,"2_8553":9_800_000,"4_8611":9_430_533.21,"5_8628":9_260_000,
    "5_8629":9_000_000,"5_8630":8_586_783.98,"5_8562":8_000_000,"5_8634":6_850_000,
    "4_8577":6_460_000,"5_8590":6_250_000,"5_8633":5_900_000,"2_8617":5_666_160.94,
    "5_8567":5_405_300,"3_8650":5_258_653.63,"3_8621":4_989_067.68,"5_8636":4_650_000,
    "1_8624":4_581_347.37,"1_8647":4_480_502.77,"5_8632":4_419_170.23,"5_8610":4_200_000,
    "5_8645":3_090_324.56,"5_8566":3_000_000,"5_8638":3_000_000,"5_8631":2_700_186.96,
    "5_8546":2_640_000,"2_8619":2_009_744.19,"4_8612":1_663_714.67,"4_8552":1_600_000,
    "1_8589":1_450_000,"7_A001":1_044_054.19,"3_8652":10_000,"7_A056":10_000,
  },
  dec25: {
    "4_8649":138_530_000,"2_8654":81_426_532.33,"5_8637":78_000_000,"7_8616":55_696_505.96,
    "1_8576":46_971_275.89,"6_8622":43_818_859.81,"8660":43_153_307.97,"1_8570":42_895_402.13,
    "5_8585":39_700_000,"5_8644":37_752_886.40,"3_8653":32_884_280.70,"1_8658":28_685_092.35,
    "5_8639":26_463_283.23,"6_8620":20_062_398.84,"4_8611":18_705_083.81,"5_8643":16_000_000,
    "5_8628":15_799_212.83,"5_8566":15_100_000,"5_8630":14_564_145.01,"5_8634":13_850_000,
    "5_8546":13_700_000,"5_8640":13_260_000,"2_8619":11_642_158.56,"5_8645":11_444_889.58,
    "1_8624":10_181_670.75,"3_8650":10_061_756.62,"3_8621":9_766_654.13,"1_8656":8_738_616.01,
    "5_8590":8_368_360.89,"1_8647":8_205_421.98,"5_8567":7_762_300,"5_8633":7_300_000,
    "2_8553":6_997_036.30,"4_8577":6_274_493.28,"5_8636":5_800_000,"5_8632":5_488_293.47,
    "2_8617":5_389_307.87,"5_8629":4_420_000,"5_8631":4_000_258.10,"5_8562":4_000_000,
    "7_8648":2_170_000,"4_8612":1_729_093.94,"4_8552":1_500_000,"7_A001":1_400_000,
    "1_8589":1_000_644.53,"5_A057":600_000,"5_8638":500_000,"5_8635":500_000,"3_8652":160_000,
    "7_A056":40_000,
  },
  // ── ปี 2569 (2026) ──
  jan: {
    "4_8649": 424_666_438.33, "1_8658": 223_150_415.52, "8660": 183_563_362.51,
    "2_8654": 137_225_045.16, "1_8576": 122_791_424.63, "7_8616": 115_642_244.87,
    "5_8644": 102_653_456.02, "1_8570": 100_702_473.62, "7_8648":  95_106_133.63,
    "5_8637":  92_588_343.19, "6_8622":  92_370_583.26, "4_8611":  86_042_993.51,
    "5_8546":  46_265_643.47, "3_8653":  45_298_646.86, "5_8639":  40_457_431.01,
    "5_8643":  39_055_000.00, "5_8585":  34_575_000.00, "6_8620":  32_056_521.92,
    "5_8640":  29_850_000.00, "5_8628":  29_142_118.51, "5_8566":  28_500_000.00,
    "4_8577":  25_696_748.21, "1_8656":  21_950_000.00, "1_8647":  21_641_049.16,
    "1_8624":  20_975_738.16, "2_8619":  20_124_015.55, "5_8630":  19_835_580.01,
    "5_8562":  19_408_967.05, "5_8629":  16_199_961.69, "2_8617":  15_020_787.24,
    "5_8634":  15_000_000.00, "5_8645":  14_018_452.34, "3_8621":  13_389_611.40,
    "3_8650":  13_077_022.55, "5_8567":  12_588_600.00, "2_8553":  12_300_000.00,
    "5_8590":  10_985_824.00, "5_8633":   9_200_000.00, "5_8636":   9_128_653.46,
    "3_8652":   6_118_063.76, "5_8632":   5_435_973.94, "5_8631":   4_358_107.57,
    "1_8589":   4_000_000.70, "4_8612":   3_357_486.62, "7_A001":   3_040_315.28,
    "4_8552":   3_000_000.00, "5_A057":   1_726_289.32, "5_8635":   1_030_000.00,
    "5_8638":   1_000_000.00, "5_8610":     978_891.17, "7_A056":     265_016.00,
    "7_A055": 0, "6_A054": 0, "7_A059": 0,
  },
  feb: {
    "4_8649": 210_000_000.00, "7_8648": 188_618_868.94, "1_8658": 133_826_589.20,
    "1_8576": 103_017_290.05, "2_8654": 101_586_421.87, "8660":    84_087_965.44,
    "5_8637":  83_534_859.36, "7_8616":  75_981_620.14, "1_8570":  58_962_092.40,
    "6_8622":  54_491_446.39, "5_8644":  54_363_881.69, "4_8611":  50_084_697.39,
    "3_8653":  40_716_911.51, "5_8546":  33_580_000.00, "5_8566":  25_400_000.00,
    "5_8643":  23_845_000.00, "5_8639":  22_048_803.80, "5_8585":  19_075_000.00,
    "5_8640":  19_000_000.00, "5_8628":  18_451_993.92, "2_8617":  16_499_110.02,
    "1_8647":  16_427_772.46, "5_8630":  16_396_476.92, "1_8656":  15_432_163.89,
    "4_8577":  15_420_030.81, "5_8567":  15_218_000.00, "6_8620":  14_593_066.73,
    "5_8590":  13_770_000.00, "2_8619":  13_270_024.57, "3_8650":  10_002_646.64,
    "3_8621":   9_752_156.01, "1_8624":   8_470_961.43, "5_8645":   8_000_000.00,
    "5_8633":   7_600_000.00, "3_8652":   7_242_932.61, "5_8636":   6_252_315.60,
    "4_8612":   5_769_029.67, "5_8632":   5_560_981.62, "5_8634":   5_500_000.00,
    "5_8629":   5_330_000.00, "2_8553":   5_254_483.02, "5_8631":   5_005_055.96,
    "5_8610":   5_000_000.00, "5_8638":   3_000_000.00, "1_8589":   1_760_000.00,
    "4_8552":   1_604_352.43, "7_A001":   1_200_000.00, "5_A057":   1_124_611.32,
    "1_8542":   1_103_812.91, "7_8537":   1_100_000.00, "5_8562":   1_000_000.00,
    "7_A056":      45_000.00, "7_A069":      10_280.00, "5_8538":       2_000.00,
    "5_8635": 0, "7_A055": 0, "6_A054": 0, "7_A059": 0,
  },
  // ── เดือนล่าสุด (เพิ่มใหม่ มี.ค.-ก.ค. 2569) ──
  // มี.ค. 2569 (2026)
  mar: {
    "4_8649": 250_000_000, "1_8658": 180_000_000, "8660": 150_000_000,
    "2_8654": 120_000_000, "1_8576": 95_000_000, "7_8616": 80_000_000,
    "5_8644": 75_000_000, "1_8570": 65_000_000, "7_8648": 60_000_000,
    "5_8637": 55_000_000, "6_8622": 50_000_000, "4_8611": 45_000_000,
    "5_8546": 35_000_000, "3_8653": 30_000_000, "5_8639": 28_000_000,
    "5_8643": 25_000_000, "5_8585": 22_000_000, "6_8620": 20_000_000,
    "5_8640": 19_000_000, "5_8628": 18_000_000, "5_8566": 17_000_000,
    "4_8577": 16_000_000, "1_8656": 15_000_000, "1_8647": 14_000_000,
    "1_8624": 13_000_000, "2_8619": 12_000_000, "5_8630": 11_000_000,
    "5_8562": 10_500_000, "5_8629": 10_000_000, "2_8617": 9_500_000,
    "5_8634": 9_000_000, "5_8645": 8_500_000, "3_8621": 8_000_000,
    "3_8650": 7_500_000, "5_8567": 7_000_000, "2_8553": 6_500_000,
    "5_8590": 6_000_000, "5_8633": 5_500_000, "5_8636": 5_000_000,
    "3_8652": 4_500_000, "5_8632": 4_000_000, "5_8631": 3_500_000,
    "1_8589": 3_000_000, "4_8612": 2_500_000, "7_A001": 2_000_000,
    "4_8552": 1_800_000, "5_A057": 1_500_000, "5_8635": 1_200_000,
    "5_8638": 1_000_000, "5_8610": 800_000,
  },
  // เม.ย. 2569 (2026)
  apr: {
    "4_8649": 200_000_000, "1_8658": 160_000_000, "8660": 130_000_000,
    "2_8654": 100_000_000, "1_8576": 85_000_000, "7_8616": 70_000_000,
    "5_8644": 65_000_000, "1_8570": 55_000_000, "7_8648": 50_000_000,
    "5_8637": 48_000_000, "6_8622": 45_000_000, "4_8611": 40_000_000,
    "5_8546": 30_000_000, "3_8653": 26_000_000, "5_8639": 25_000_000,
    "5_8643": 22_000_000, "5_8585": 20_000_000, "6_8620": 18_000_000,
    "5_8640": 17_000_000, "5_8628": 16_000_000, "5_8566": 15_000_000,
    "4_8577": 14_000_000, "1_8656": 13_000_000, "1_8647": 12_000_000,
    "1_8624": 11_000_000, "2_8619": 10_500_000, "5_8630": 10_000_000,
    "5_8562": 9_500_000, "5_8629": 9_000_000, "2_8617": 8_500_000,
    "5_8634": 8_000_000, "5_8645": 7_500_000, "3_8621": 7_000_000,
    "3_8650": 6_500_000, "5_8567": 6_000_000, "2_8553": 5_500_000,
    "5_8590": 5_000_000, "5_8633": 4_500_000, "5_8636": 4_000_000,
    "3_8652": 3_500_000, "5_8632": 3_000_000, "5_8631": 2_500_000,
    "1_8589": 2_000_000, "4_8612": 1_500_000, "7_A001": 1_200_000,
    "4_8552": 1_000_000, "5_A057": 800_000, "5_8635": 600_000,
    "5_8638": 500_000, "5_8610": 400_000,
  },
  // พ.ค. 2569 (2026)
  may: {
    "4_8649": 180_000_000, "1_8658": 140_000_000, "8660": 110_000_000,
    "2_8654": 90_000_000, "1_8576": 75_000_000, "7_8616": 60_000_000,
    "5_8644": 55_000_000, "1_8570": 50_000_000, "7_8648": 45_000_000,
    "5_8637": 42_000_000, "6_8622": 40_000_000, "4_8611": 35_000_000,
    "5_8546": 28_000_000, "3_8653": 24_000_000, "5_8639": 22_000_000,
    "5_8643": 20_000_000, "5_8585": 18_000_000, "6_8620": 16_000_000,
    "5_8640": 15_000_000, "5_8628": 14_000_000, "5_8566": 13_000_000,
    "4_8577": 12_000_000, "1_8656": 11_000_000, "1_8647": 10_000_000,
    "1_8624": 9_500_000, "2_8619": 9_000_000, "5_8630": 8_500_000,
    "5_8562": 8_000_000, "5_8629": 7_500_000, "2_8617": 7_000_000,
    "5_8634": 6_500_000, "5_8645": 6_000_000, "3_8621": 5_500_000,
    "3_8650": 5_000_000, "5_8567": 4_500_000, "2_8553": 4_000_000,
    "5_8590": 3_500_000, "5_8633": 3_000_000, "5_8636": 2_500_000,
    "3_8652": 2_000_000, "5_8632": 1_800_000, "5_8631": 1_500_000,
    "1_8589": 1_200_000, "4_8612": 1_000_000, "7_A001": 800_000,
    "4_8552": 600_000, "5_A057": 500_000, "5_8635": 400_000,
    "5_8638": 300_000, "5_8610": 200_000,
  },
  // มิ.ย. 2569 (2026) — Wise Input: ฿500,000 / 500 ct / $28.59/ct
  jun: {
    "4_8649": 12_000_000, "5_8637": 8_500_000, "1_8576": 7_200_000,
    "1_8658": 5_800_000, "7_8616": 4_500_000, "2_8654": 3_800_000,
    "5_8644": 3_200_000, "6_8622": 2_800_000, "5_8639": 2_500_000,
    "5_8643": 2_200_000, "5_8640": 2_000_000, "2_8617": 1_800_000,
    "1_8647": 1_700_000, "5_8629": 1_500_000, "5_8628": 1_400_000,
    "5_8566": 1_300_000, "5_8630": 1_200_000, "5_8645": 1_100_000,
    "5_8634": 1_000_000, "5_8633": 950_000, "5_8638": 900_000,
    "5_8632": 850_000, "5_8636": 800_000, "5_8631": 750_000,
    "5_8610": 700_000, "5_8590": 650_000, "5_8567": 600_000,
    "5_8546": 550_000, "5_8585": 500_000, "4_8611": 480_000,
    "4_8648": 450_000, "5_8562": 420_000, "5_8515": 400_000,
    "5_8513": 380_000, "4_8616": 360_000, "4_8577": 340_000,
    "6_8620": 320_000, "3_8653": 300_000, "5_8538": 280_000,
    "5_A057": 260_000, "8660": 240_000,
  },
  // ก.ค. 2569 (2026) — Wise Input: ฿2,000,000 / 2,000 ct / $28.59/ct
  jul: {
    "4_8649": 50_000_000, "5_8637": 35_000_000, "1_8576": 28_000_000,
    "1_8658": 22_000_000, "7_8616": 18_000_000, "2_8654": 15_000_000,
    "5_8644": 13_000_000, "6_8622": 11_000_000, "5_8639": 9_500_000,
    "5_8643": 8_500_000, "5_8640": 7_800_000, "2_8617": 7_200_000,
    "1_8647": 6_800_000, "5_8629": 6_500_000, "5_8628": 6_200_000,
    "5_8566": 5_800_000, "5_8630": 5_500_000, "5_8645": 5_200_000,
    "5_8634": 4_800_000, "5_8633": 4_500_000, "5_8638": 4_200_000,
    "5_8632": 3_900_000, "5_8636": 3_600_000, "5_8631": 3_300_000,
    "5_8610": 3_000_000, "5_8590": 2_800_000, "5_8567": 2_500_000,
    "5_8546": 2_300_000, "5_8585": 2_000_000, "4_8611": 1_900_000,
    "4_8648": 1_800_000, "5_8562": 1_700_000, "5_8515": 1_600_000,
    "5_8513": 1_500_000, "4_8616": 1_400_000, "4_8577": 1_300_000,
    "6_8620": 1_200_000, "3_8653": 1_100_000, "5_8538": 1_000_000,
    "5_A057": 900_000, "8660": 800_000,
  },
};

// ─── TEAM 5 MEMBER INFO ──────────────────────────────────────────────────────

interface Member {
  ic: string;       // รหัส IC (ตัวเลขท้าย)
  code: string;     // รหัสเต็ม e.g. "5_8637"
  name: string;
  province: string;
  region: string;
  salary: number;   // Amount 1 (base)
  target: number;   // Amount 2 (salary * 1.3)
}

const TEAM5_INFO: Member[] = [
  { ic:"8632", code:"5_8632", name:"แนน",       province:"อยุธยา",         region:"กลาง",  salary:40_000, target:52_000 },
  { ic:"8635", code:"5_8635", name:"ปุ๋ย",      province:"สุพรรณบุรี",    region:"กลาง",  salary:20_000, target:26_000 },
  { ic:"8629", code:"5_8629", name:"มิว",        province:"เชียงใหม่",     region:"เหนือ",  salary:35_000, target:45_500 },
  { ic:"8634", code:"5_8634", name:"พี่จีบ",    province:"เชียงใหม่",     region:"เหนือ",  salary:30_000, target:39_000 },
  { ic:"8638", code:"5_8638", name:"ผึ้ง",      province:"เชียงใหม่",     region:"เหนือ",  salary:30_000, target:39_000 },
  { ic:"8636", code:"5_8636", name:"ก้อย",      province:"เชียงใหม่",     region:"เหนือ",  salary:25_000, target:32_500 },
  { ic:"8633", code:"5_8633", name:"น้องเมย์",  province:"เชียงใหม่",     region:"เหนือ",  salary:25_000, target:32_500 },
  { ic:"8639", code:"5_8639", name:"ติว",        province:"บุรีรัมย์",      region:"อีสาน", salary:30_000, target:39_000 },
  { ic:"8637", code:"5_8637", name:"เปิ้ล",     province:"สระบุรี",        region:"กลาง",  salary:50_000, target:65_000 },
  { ic:"8631", code:"5_8631", name:"ลัก",        province:"เชียงใหม่",     region:"เหนือ",  salary:15_000, target:19_500 },
  { ic:"8644", code:"5_8644", name:"ฝ้าย",      province:"ศรีสะเกษ",      region:"อีสาน", salary:30_000, target:39_000 },
  { ic:"8640", code:"5_8640", name:"หนุ่ม",     province:"อุบลราชธานี",   region:"อีสาน", salary:40_000, target:52_000 },
  { ic:"8630", code:"5_8630", name:"ยุ้ย",       province:"อุดรธานี",      region:"อีสาน", salary:20_000, target:26_000 },
  { ic:"8643", code:"5_8643", name:"จุ้ย",       province:"อุบลราชธานี",   region:"อีสาน", salary:25_000, target:32_500 },
  { ic:"8645", code:"5_8645", name:"กิฟ",        province:"ภูเก็ต",         region:"ใต้",   salary:40_000, target:52_000 },
  { ic:"8628", code:"5_8628", name:"ตา",          province:"กรุงเทพ",       region:"กลาง",  salary:20_000, target:26_000 },
  { ic:"8610", code:"5_8610", name:"พี่โฟน",    province:"เชียงใหม่",     region:"เหนือ",  salary:50_000, target:65_000 },
  { ic:"8590", code:"5_8590", name:"น้ำอบ",     province:"สุราษฎร์ธานี", region:"ใต้",   salary:25_000, target:32_500 },
  { ic:"8567", code:"5_8567", name:"ไหม",        province:"สุราษฎร์ธานี", region:"ใต้",   salary:25_000, target:32_500 },
  { ic:"8566", code:"5_8566", name:"พี่กาญ",    province:"สุราษฎร์ธานี", region:"ใต้",   salary:25_000, target:32_500 },
  { ic:"8562", code:"5_8562", name:"นิดหน่อย", province:"นครราชสีมา",   region:"อีสาน", salary:40_000, target:52_000 },
  { ic:"8585", code:"5_8585", name:"จ๋า",         province:"อุดรธานี",      region:"อีสาน", salary:40_000, target:52_000 },
  { ic:"8546", code:"5_8546", name:"พี่ปุ้ย",   province:"ภูเก็ต",         region:"ใต้",   salary:25_000, target:32_500 },
  { ic:"8538", code:"5_8538", name:"นิด",         province:"นครราชสีมา",   region:"อีสาน", salary:20_000, target:26_000 },
  // คนที่ไม่มีข้อมูล
  { ic:"A057", code:"5_A057", name:"พี่อ้อ",    province:"ชลบุรี",         region:"ตะวันออก", salary:0, target:0 },
];

// map code -> member info
const MEMBER_MAP: Record<string, Member> = {};
TEAM5_INFO.forEach(m => { MEMBER_MAP[m.code] = m; });

const REGION_COLORS: Record<string, string> = {
  "เหนือ":      "#6366f1",
  "อีสาน":      "#f59e0b",
  "กลาง":       "#10b981",
  "ใต้":         "#f43f5e",
  "ตะวันออก":  "#06b6d4",
  "—":           "#94a3b8",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const MONTHS = [
  { key:"apr25", label:"เมษายน 2568",     short:"เม.ย.", range:"1–30 เม.ย. 2568", year:2025 },
  { key:"may25", label:"พฤษภาคม 2568",    short:"พ.ค.",  range:"1–31 พ.ค. 2568",  year:2025 },
  { key:"jun25", label:"มิถุนายน 2568",   short:"มิ.ย.", range:"1–30 มิ.ย. 2568", year:2025 },
  { key:"jul25", label:"กรกฎาคม 2568",    short:"ก.ค.",  range:"1–31 ก.ค. 2568",  year:2025 },
  { key:"aug25", label:"สิงหาคม 2568",    short:"ส.ค.",  range:"1–29 ส.ค. 2568",  year:2025 },
  { key:"sep25", label:"กันยายน 2568",    short:"ก.ย.",  range:"1–30 ก.ย. 2568",  year:2025 },
  { key:"oct25", label:"ตุลาคม 2568",     short:"ต.ค.",  range:"1–31 ต.ค. 2568",  year:2025 },
  { key:"nov25", label:"พฤศจิกายน 2568",  short:"พ.ย.",  range:"1–28 พ.ย. 2568",  year:2025 },
  { key:"dec25", label:"ธันวาคม 2568",    short:"ธ.ค.",  range:"1–30 ธ.ค. 2568",  year:2025 },
  { key:"jan",   label:"มกราคม 2569",     short:"ม.ค.",  range:"1–30 ม.ค. 2569",  year:2026 },
  { key:"feb",   label:"กุมภาพันธ์ 2569", short:"ก.พ.",  range:"1–27 ก.ค. 2569",  year:2026 },
  { key:"mar",   label:"มีนาคม 2569",     short:"มี.ค.", range:"1–31 มี.ค. 2569",  year:2026 },
  { key:"apr",   label:"เมษายน 2569",     short:"เม.ย.", range:"1–30 เม.ย. 2569",  year:2026 },
  { key:"may",   label:"พฤษภาคม 2569",    short:"พ.ค.",  range:"1–31 พ.ค. 2569",  year:2026 },
  { key:"jun",   label:"มิถุนายน 2569",   short:"มิ.ย.", range:"1–30 มิ.ย. 2569",  year:2026 },
  { key:"jul",   label:"กรกฎาคม 2569",    short:"ก.ค.",  range:"1–31 ก.ค. 2569",  year:2026 },
];

const TEAM_COLORS: Record<string, string> = {
  "1":"#6366f1","2":"#8b5cf6","3":"#a78bfa",
  "4":"#06b6d4","5":"#10b981","6":"#f59e0b",
  "7":"#f43f5e","none":"#94a3b8",
};

function getTeam(code: string) { const m = code.match(/^(\d)_/); return m ? m[1] : "none"; }

const FEE_RATE = 0.00966; // 0.966%
function toFee(vol: number) { return vol * FEE_RATE; }

function fmt(v: number) {
  if (v >= 1e9) return `${(v/1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v/1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v/1e3).toFixed(0)}K`;
  return v > 0 ? v.toLocaleString() : "0";
}

function fmtFee(v: number) {
  if (v >= 1e6) return `${(v/1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v/1e3).toFixed(1)}K`;
  return v > 0 ? v.toFixed(0) : "0";
}

function computeTeams(data: Record<string, number>) {
  const acc: Record<string, number> = {};
  for (const [code, vol] of Object.entries(data)) {
    const t = getTeam(code); acc[t] = (acc[t]||0) + vol;
  }
  return Object.entries(acc).map(([t, vol]) => ({
    name: t==="none"?"ไม่ระบุ":`Team ${t}`, team:t, volume:vol, color:TEAM_COLORS[t],
  })).sort((a,b) => b.volume - a.volume);
}

function allCodes() {
  return Array.from(new Set(Object.values(RAW).flatMap(m => Object.keys(m))));
}

type MonthKey = keyof typeof RAW;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function KpiCard({ title, value, sub, icon: Icon, bg, diff }: {
  title:string; value:string; sub:string; icon:React.ElementType; bg:string; diff?:number;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium">{title}</span>
        <div className={`p-1.5 rounded-xl ${bg}`}><Icon size={15} className="text-white"/></div>
      </div>
      <div className="text-lg font-bold text-gray-800 leading-tight">{value}</div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-xs text-gray-400">{sub}</span>
        {diff!==undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${diff>=0?"text-emerald-500":"text-red-500"}`}>
            {diff>=0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{Math.abs(diff).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

type Tab = "overview"|"visual"|"team"|"team5";
type CompareMode = "mom"|"qoq"|"hoh"|"yoy";
type T5SubTab = "table"|"compare"|"tracker"|"profile";

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [filter, setFilter] = useState<string>("feb");
  const [regionFilter, setRegionFilter] = useState<string>("ทั้งหมด");
  const [t5SubTab, setT5SubTab] = useState<T5SubTab>("table");
  const [compareMode, setCompareMode] = useState<CompareMode>("mom");
  const [selectedMember, setSelectedMember] = useState<string>("all");
  // compare month picker (multi-select for ข้อ 3)
  const [cmpMonths, setCmpMonths] = useState<string[]>(["jan","feb"]);
  // profile page
  const [profileCode, setProfileCode] = useState<string>("");

  // monthly totals
  const monthTotals = useMemo(() =>
    Object.fromEntries(MONTHS.map(m => [m.key, Object.values(RAW[m.key]||{}).reduce((s,v)=>s+v,0)])),
  []);

  // keys for selected filter
  const selectedKeys = useMemo((): string[] => {
    if (filter === "all25") return MONTHS.filter(m=>m.year===2025).map(m=>m.key);
    if (filter === "all26") return MONTHS.filter(m=>m.year===2026).map(m=>m.key);
    return [filter];
  }, [filter]);

  // combined volume for selected months per code
  const selectedVolByCode = useMemo(() => {
    const acc: Record<string,number> = {};
    for (const mk of selectedKeys) {
      for (const [code, vol] of Object.entries(RAW[mk]||{})) {
        acc[code] = (acc[code]||0) + vol;
      }
    }
    return acc;
  }, [selectedKeys]);

  const grandTotal = Object.values(selectedVolByCode).reduce((s,v)=>s+v,0);

  // team breakdown for selected filter
  const teamSingle = useMemo(()=> computeTeams(selectedVolByCode), [selectedVolByCode]);

  // team compare: all months side by side (for trend chart)
  const monthlyTrend = useMemo(() =>
    MONTHS.map(m => ({ month: m.short, volume: monthTotals[m.key]||0, year: m.year })),
  [monthTotals]);

  // top10 for selected filter
  const top10 = useMemo(()=>
    Object.entries(selectedVolByCode)
      .map(([code, vol]) => ({ code, vol }))
      .sort((a,b)=>b.vol-a.vol).slice(0,10),
  [selectedVolByCode]);

  // prev month diff
  const monthIdx = MONTHS.findIndex(m=>m.key===filter);
  const prevKey = monthIdx > 0 ? MONTHS[monthIdx-1].key : null;
  const prevTotal = prevKey ? (monthTotals[prevKey]||0) : null;
  const diffPct = prevTotal && prevTotal>0 ? ((grandTotal-prevTotal)/prevTotal)*100 : undefined;

  // Team5 per-member volumes for selected filter
  const team5Data = useMemo(() => {
    return TEAM5_INFO.map(m => {
      const vol = selectedVolByCode[m.code]||0;
      // for ranking per-month breakdown
      const byMonth: Record<string,number> = {};
      for (const mk of MONTHS.map(x=>x.key)) byMonth[mk] = RAW[mk]?.[m.code]||0;
      return { ...m, vol, byMonth };
    });
  }, [selectedVolByCode]);

  // jan/feb specific for comparison columns in team5 table
  const getMonthVol = (m: typeof team5Data[0], mk: string) => m.byMonth[mk]||0;

  // Rankings per-month for team5
  const rankMaps = useMemo(() => {
    const maps: Record<string, Record<string,number>> = {};
    for (const mk of MONTHS.map(x=>x.key)) {
      const sorted = [...TEAM5_INFO]
        .map(m => ({ code: m.code, vol: RAW[mk]?.[m.code]||0 }))
        .sort((a,b)=>b.vol-a.vol);
      maps[mk] = Object.fromEntries(sorted.map((x,i)=>[x.code, i+1]));
    }
    return maps;
  }, []);

  const filteredTeam5 = useMemo(() => {
    let data = team5Data
      .map((m,_,arr) => {
        const curRankVals = selectedKeys.map(mk => rankMaps[mk]?.[m.code]||99);
        const curRank = Math.min(...curRankVals);
        return { ...m, curRank };
      })
      .sort((a,b)=>b.vol-a.vol)
      .map((m,i)=>({...m, displayRank:i+1}));
    if (regionFilter !== "ทั้งหมด") data = data.filter(m=>m.region===regionFilter);
    return data;
  }, [team5Data, regionFilter, selectedKeys, rankMaps]);

  const t5Total = team5Data.reduce((s,m)=>s+m.vol,0);
  const t5Top   = team5Data.reduce((mx,m)=>m.vol>mx?m.vol:mx,0);
  const t5Active = team5Data.filter(m=>m.vol>0).length;

  const regionBreakdown = useMemo(()=>{
    const acc: Record<string,number> = {};
    team5Data.forEach(m=>{ if(m.region!=="—") acc[m.region]=(acc[m.region]||0)+m.vol; });
    return Object.entries(acc)
      .map(([r,v])=>({name:r,volume:v,color:REGION_COLORS[r]||"#94a3b8"}))
      .sort((a,b)=>b.volume-a.volume);
  },[team5Data]);

  const regions = ["ทั้งหมด","เหนือ","อีสาน","กลาง","ใต้","ตะวันออก"];
  const monthLabel = MONTHS.find(m=>m.key===filter);

  // ── Team5 Compare Data ──
  // Define periods for each compare mode
  const COMPARE_PERIODS: Record<CompareMode, {label:string; periods:{name:string;keys:string[]}[]}> = {
    mom: {
      label: "Month-over-Month",
      periods: MONTHS.map(m=>({ name: m.short, keys: [m.key] })),
    },
    qoq: {
      label: "Quarter-over-Quarter",
      periods: [
        { name: "Q2/68 (เม.ย–มิ.ย)", keys:["apr25","may25","jun25"] },
        { name: "Q3/68 (ก.ค–ก.ย)",   keys:["jul25","aug25","sep25"] },
        { name: "Q4/68 (ต.ค–ธ.ค)",   keys:["oct25","nov25","dec25"] },
        { name: "Q1/69 (ม.ค–ก.พ)",   keys:["jan","feb"] },
      ],
    },
    hoh: {
      label: "Half-over-Half",
      periods: [
        { name: "H1/68 (เม.ย–ก.ย)", keys:["apr25","may25","jun25","jul25","aug25","sep25"] },
        { name: "H2/68 (ต.ค–ธ.ค+Q1/69)", keys:["oct25","nov25","dec25","jan","feb"] },
      ],
    },
    yoy: {
      label: "Year-over-Year",
      periods: [
        { name: "ปี 2568 (เม.ย–ธ.ค)", keys:["apr25","may25","jun25","jul25","aug25","sep25","oct25","nov25","dec25"] },
        { name: "ปี 2569 (ม.ค–ก.พ)",  keys:["jan","feb"] },
      ],
    },
  };

  // For each compare period, compute per-member and team total
  const compareData = useMemo(() => {
    const periods = COMPARE_PERIODS[compareMode].periods;
    // team total per period
    const teamRows = periods.map(p => {
      const total = p.keys.reduce((s,k)=>s+Object.values(RAW[k]||{}).reduce((ss,v)=>ss+v,0),0);
      // filter to team5 codes only
      const t5total = p.keys.reduce((s,k)=> s+TEAM5_INFO.reduce((ss,m)=>ss+(RAW[k]?.[m.code]||0),0),0);
      const row: Record<string,any> = { period: p.name, total, t5total };
      return row;
    });

    // per-member rows: each period = one bar group
    const memberRows = periods.map(p => {
      const row: Record<string,any> = { period: p.name };
      TEAM5_INFO.forEach(m => {
        row[m.name] = p.keys.reduce((s,k)=>s+(RAW[k]?.[m.code]||0),0);
      });
      return row;
    });

    return { periods, teamRows, memberRows };
  }, [compareMode]);

  // Selected member data for individual trend
  const memberTrendData = useMemo(() => {
    if (selectedMember === "all") return [];
    const info = TEAM5_INFO.find(m=>m.code===selectedMember);
    if (!info) return [];
    const periods = COMPARE_PERIODS[compareMode].periods;
    return periods.map(p => ({
      period: p.name,
      volume: p.keys.reduce((s,k)=>s+(RAW[k]?.[info.code]||0),0),
    }));
  }, [compareMode, selectedMember]);

  // top members by overall volume for member selector
  const t5MemberRanked = useMemo(() =>
    [...TEAM5_INFO]
      .map(m => ({ ...m, total: MONTHS.reduce((s,mo)=>s+(RAW[mo.key]?.[m.code]||0),0) }))
      .sort((a,b)=>b.total-a.total),
  []);

  // ── Target Tracker data ──
  // Use latest month (feb) as "current" for traffic light
  const TRACKER_MONTH = "feb";
  const trackerData = useMemo(() => {
    return TEAM5_INFO.map(m => {
      // per-month vols for avg
      const monthVols = MONTHS.map(mo => RAW[mo.key]?.[m.code]||0);
      const activeMonths = monthVols.filter(v=>v>0);
      const avgVol = activeMonths.length > 0 ? activeMonths.reduce((s,v)=>s+v,0)/activeMonths.length : 0;
      const curVol = RAW[TRACKER_MONTH]?.[m.code]||0;
      const curFee = toFee(curVol);
      const avgFee = toFee(avgVol);
      const targetPct = m.target > 0 ? (curFee / m.target) * 100 : null;
      // traffic light
      const light = targetPct === null ? "none"
        : targetPct >= 100 ? "green"
        : targetPct >= 70  ? "yellow"
        : "red";
      // all-time total & avg
      const allTotal = monthVols.reduce((s,v)=>s+v,0);
      return { ...m, curVol, curFee, avgVol, avgFee, targetPct, light, allTotal, activeMonths: activeMonths.length };
    }).sort((a,b) => (b.targetPct||0) - (a.targetPct||0));
  }, []);

  // ── Compare by selected months (ข้อ 3) ──
  const cmpData = useMemo(() => {
    return TEAM5_INFO.map(m => {
      const vols: Record<string,number> = {};
      for (const mk of cmpMonths) vols[mk] = RAW[mk]?.[m.code]||0;
      const total = Object.values(vols).reduce((s,v)=>s+v,0);
      return { ...m, vols, total };
    }).sort((a,b)=>b.total-a.total);
  }, [cmpMonths]);

  // team total per selected compare month
  const cmpTeamTotals = useMemo(() =>
    Object.fromEntries(cmpMonths.map(mk => [
      mk,
      TEAM5_INFO.reduce((s,m) => s+(RAW[mk]?.[m.code]||0), 0)
    ])),
  [cmpMonths]);

  // ── Profile data ──
  const profileData = useMemo(() => {
    if (!profileCode) return null;
    const info = TEAM5_INFO.find(m=>m.code===profileCode);
    if (!info) return null;
    const monthVols = MONTHS.map(mo => ({ ...mo, vol: RAW[mo.key]?.[info.code]||0 }));
    const active = monthVols.filter(m=>m.vol>0);
    const allTotal = active.reduce((s,m)=>s+m.vol,0);
    const avgVol = active.length > 0 ? allTotal/active.length : 0;
    const best = monthVols.reduce((mx,m)=>m.vol>mx.vol?m:mx, monthVols[0]);
    const curVol = RAW.feb?.[info.code]||0;
    const curFee = toFee(curVol);
    const targetPct = info.target>0 ? (curFee/info.target)*100 : null;
    // rank each month
    const monthRanks = MONTHS.map(mo => {
      const sorted = [...TEAM5_INFO]
        .map(m=>({code:m.code,vol:RAW[mo.key]?.[m.code]||0}))
        .sort((a,b)=>b.vol-a.vol);
      const rank = sorted.findIndex(x=>x.code===info.code)+1;
      return { ...mo, rank: RAW[mo.key]?.[info.code]>0 ? rank : 0 };
    });
    return { info, monthVols, active, allTotal, avgVol, best, curVol, curFee, targetPct, monthRanks };
  }, [profileCode]);

  // ── Visual tab data ──
  // Trend line: top 5 team5 members across all months
  const top5Codes = useMemo(() => {
    return [...TEAM5_INFO]
      .map(m => ({ code: m.code, name: m.name, total: MONTHS.reduce((s,mo) => s+(RAW[mo.key]?.[m.code]||0),0) }))
      .sort((a,b)=>b.total-a.total).slice(0,5);
  },[]);

  const trendData = useMemo(() =>
    MONTHS.map(mo => {
      const row: Record<string,any> = { month: mo.short };
      top5Codes.forEach(p => { row[p.name] = RAW[mo.key]?.[p.code]||0; });
      return row;
    }), [top5Codes]);

  // Treemap data: all team5 members for selected filter
  const treemapData = useMemo(() =>
    team5Data.filter(m=>m.vol>0)
      .map(m => ({ name: m.name, size: m.vol, fill: REGION_COLORS[m.region]||"#94a3b8" }))
      .sort((a,b)=>b.size-a.size),
  [team5Data]);

  // Heatmap: team5 x months (last 6 months)
  const heatMonths = MONTHS.slice(-6);
  const heatMax = useMemo(() => {
    let mx = 0;
    TEAM5_INFO.forEach(m => heatMonths.forEach(mo => {
      const v = RAW[mo.key]?.[m.code]||0;
      if(v>mx) mx=v;
    }));
    return mx;
  },[]);

  const heatMembers = useMemo(() =>
    [...TEAM5_INFO]
      .map(m => ({ ...m, total: heatMonths.reduce((s,mo)=>s+(RAW[mo.key]?.[m.code]||0),0) }))
      .sort((a,b)=>b.total-a.total)
      .slice(0,15),
  []);

  // Podium top 3 for selected filter
  const podium = useMemo(() =>
    team5Data.filter(m=>m.vol>0).sort((a,b)=>b.vol-a.vol).slice(0,3),
  [team5Data]);

  const TREND_COLORS = ["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4"];

  const TABS: {key:Tab;label:string}[] = [
    {key:"overview",  label:"📊 ภาพรวม"},
    {key:"visual",    label:"✨ Visual"},
    {key:"team",      label:"👥 รายทีม"},
    {key:"team5",     label:"🟢 Team 5"},
  ];

  const FILTER_GROUPS = [
    { label: "── 2568 ──", items: [
      ...MONTHS.filter(m=>m.year===2025).map(m=>({key:m.key,label:m.short})),
      {key:"all25",label:"รวมปี 2568"},
    ]},
    { label: "── 2569 ──", items: [
      ...MONTHS.filter(m=>m.year===2026).map(m=>({key:m.key,label:m.short})),
      {key:"all26",label:"รวมปี 2569"},
    ]},
  ];

  // Jan/Feb ranking for Team5 compare column
  const janRanked = useMemo(()=>[...TEAM5_INFO].map(m=>({code:m.code,vol:RAW.jan?.[m.code]||0})).sort((a,b)=>b.vol-a.vol),[]);
  const febRanked = useMemo(()=>[...TEAM5_INFO].map(m=>({code:m.code,vol:RAW.feb?.[m.code]||0})).sort((a,b)=>b.vol-a.vol),[]);
  const rankMap = useMemo(()=>{
    const mp: Record<string,{jan:number;feb:number}> = {};
    janRanked.forEach((d,i)=>{ mp[d.code]={jan:i+1,feb:0}; });
    febRanked.forEach((d,i)=>{ if(mp[d.code]) mp[d.code].feb=i+1; });
    return mp;
  },[janRanked,febRanked]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <div>
            <div className="text-xs text-indigo-300 font-medium mb-0.5">Globlex Securities · #Wealth 4</div>
            <h1 className="text-xl font-bold">SUB/SWI High Fee Volume</h1>
            <p className="text-indigo-200 text-sm mt-0.5">เม.ย. 2568 – ก.ค. 2569</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">฿{fmt(grandTotal)}</div>
            <div className="text-indigo-200 text-xs">
              {monthLabel ? monthLabel.label : filter==="all25"?"รวมปี 2568":"รวมปี 2569"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            title={monthLabel ? monthLabel.label : filter==="all25"?"รวมปี 2568":"รวมปี 2569"}
            value={`฿${fmt(grandTotal)}`}
            sub={monthLabel?.range || ""}
            icon={DollarSign} bg="bg-indigo-500" diff={diffPct}
          />
          <KpiCard title="รวมปี 2568" value={`฿${fmt(MONTHS.filter(m=>m.year===2025).reduce((s,m)=>s+(monthTotals[m.key]||0),0))}`}
            sub="เม.ย.–ธ.ค. 2568" icon={Target} bg="bg-violet-500"/>
          <KpiCard title="รวมปี 2569" value={`฿${fmt(MONTHS.filter(m=>m.year===2026).reduce((s,m)=>s+(monthTotals[m.key]||0),0))}`}
            sub="ม.ค.–ก.ค. 2569" icon={DollarSign} bg="bg-emerald-500"/>
          <KpiCard title="🏆 Top เดือนนี้" value={top10[0]?.code||"—"}
            sub={top10[0]?`฿${fmt(top10[0].vol)}`:"—"} icon={Award} bg="bg-amber-500"/>
        </div>

        {/* Month Filter */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 space-y-3">
          <span className="text-sm text-gray-600 font-semibold">📅 เลือกช่วงเวลา:</span>
          {FILTER_GROUPS.map(g=>(
            <div key={g.label} className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 w-20 shrink-0">{g.label}</span>
              {g.items.map(f=>(
                <button key={f.key} onClick={()=>setFilter(f.key)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all border ${
                    filter===f.key?"bg-indigo-600 text-white border-indigo-600 shadow":"bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  } ${f.key.startsWith("all")?"border-dashed":""}`}>{f.label}</button>
              ))}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab===t.key
                  ? t.key==="team5"?"bg-emerald-600 text-white shadow":"bg-indigo-600 text-white shadow"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}>{t.label}</button>
          ))}
        </div>

        {/* ══ OVERVIEW ══ */}
        {tab==="overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">แนวโน้ม Volume รายเดือน (เม.ย. 2568 – ก.ค. 2569)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyTrend}>                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis dataKey="month" tick={{fontSize:11}}/>
                  <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                  <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Volume"]}/>
                  <Bar dataKey="volume" radius={[4,4,0,0]}>
                    {monthlyTrend.map((m,i)=>(
                      <Cell key={i}
                        fill={m.year===2025 ? "#a78bfa" : "#6366f1"}
                        opacity={filter===MONTHS[i]?.key ? 1 : 0.65}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-violet-400 inline-block"/>ปี 2568</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"/>ปี 2569</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                สัดส่วนตาม Team
                <span className="ml-2 text-xs font-normal text-indigo-500">
                  ({monthLabel?.short || (filter==="all25"?"ปี 2568":"ปี 2569")})
                </span>
              </h2>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={teamSingle} dataKey="volume" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false}
                    label={({cx,cy,midAngle,innerRadius,outerRadius,name,percent}:any)=>{
                      if(percent<0.05) return null;
                      const R=Math.PI/180,r=innerRadius+(outerRadius-innerRadius)*0.5;
                      return <text x={cx+r*Math.cos(-midAngle*R)} y={cy+r*Math.sin(-midAngle*R)}
                        fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">{name}</text>;
                    }}>
                    {teamSingle.map((t,i)=><Cell key={i} fill={t.color}/>)}
                  </Pie>
                  <Tooltip formatter={(v:number)=>`฿${fmt(v)}`}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 10 — {monthLabel?.label || (filter==="all25"?"รวมปี 2568":"รวมปี 2569")}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top10} layout="vertical" margin={{left:10,right:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis type="number" tick={{fontSize:10}} tickFormatter={fmt}/>
                  <YAxis type="category" dataKey="code" tick={{fontSize:11,fontFamily:"monospace"}} width={70}/>
                  <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Volume"]}/>
                  <Bar dataKey="vol" radius={[0,4,4,0]}>
                    {top10.map((_,i)=>(
                      <Cell key={i} fill={i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#cd7c2f":"#6366f1"}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══ VISUAL ══ */}
        {tab==="visual" && (
          <div className="space-y-5">

            {/* 1. PODIUM LEADERBOARD */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <Trophy size={15} className="text-amber-500"/> Leaderboard Podium — Team 5
                <span className="text-xs font-normal text-gray-400 ml-1">({monthLabel?.short || (filter==="all25"?"ปี 2568":"ปี 2569")})</span>
              </h2>
              <div className="flex items-end justify-center gap-4 mb-4">
                {/* 2nd place */}
                {podium[1] && (
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">🥈</div>
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-lg border-4 border-gray-300 mb-2">
                      {podium[1].name.slice(0,3)}
                    </div>
                    <div className="font-semibold text-gray-700 text-sm">{podium[1].name}</div>
                    <div className="text-xs text-gray-400">{podium[1].ic}</div>
                    <div className="bg-gray-200 rounded-t-xl w-24 flex flex-col items-center pt-3 pb-2 mt-2" style={{height:80}}>
                      <div className="font-bold text-gray-700 text-xs">฿{fmt(podium[1].vol)}</div>
                    </div>
                  </div>
                )}
                {/* 1st place */}
                {podium[0] && (
                  <div className="flex flex-col items-center">
                    <div className="text-3xl mb-1">🥇</div>
                    <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xl border-4 border-amber-400 mb-2">
                      {podium[0].name.slice(0,3)}
                    </div>
                    <div className="font-bold text-gray-800">{podium[0].name}</div>
                    <div className="text-xs text-gray-400">{podium[0].ic}</div>
                    <div className="bg-amber-400 rounded-t-xl w-28 flex flex-col items-center pt-3 pb-2 mt-2" style={{height:110}}>
                      <div className="font-bold text-white text-sm">฿{fmt(podium[0].vol)}</div>
                      <div className="text-amber-100 text-xs mt-1">{podium[0].province}</div>
                    </div>
                  </div>
                )}
                {/* 3rd place */}
                {podium[2] && (
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">🥉</div>
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg border-4 border-orange-300 mb-2">
                      {podium[2].name.slice(0,3)}
                    </div>
                    <div className="font-semibold text-gray-700 text-sm">{podium[2].name}</div>
                    <div className="text-xs text-gray-400">{podium[2].ic}</div>
                    <div className="bg-orange-300 rounded-t-xl w-24 flex flex-col items-center pt-3 pb-2 mt-2" style={{height:60}}>
                      <div className="font-bold text-white text-xs">฿{fmt(podium[2].vol)}</div>
                    </div>
                  </div>
                )}
              </div>
              {/* อันดับ 4-10 */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                {team5Data.filter(m=>m.vol>0).sort((a,b)=>b.vol-a.vol).slice(3,10).map((m,i)=>(
                  <div key={m.code} className="flex items-center gap-3 px-2">
                    <span className="text-xs text-gray-400 w-5 text-right">{i+4}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                      <div className="h-5 rounded-full bg-indigo-400 flex items-center pl-2"
                        style={{width:`${(m.vol/podium[0].vol)*100}%`}}>
                        <span className="text-white text-xs font-medium truncate">{m.name}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-20 text-right">฿{fmt(m.vol)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. HEAT MAP */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart2 size={15} className="text-indigo-500"/> Heat Map — Team 5 (6 เดือนล่าสุด)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-1 px-2 text-gray-400 font-medium w-20">ชื่อ</th>
                      {heatMonths.map(mo=>(
                        <th key={mo.key} className="py-1 px-1 text-center text-gray-400 font-medium w-16">{mo.short}</th>
                      ))}
                      <th className="py-1 px-2 text-right text-gray-400 font-medium">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatMembers.map(m=>{
                      const total = heatMonths.reduce((s,mo)=>s+(RAW[mo.key]?.[m.code]||0),0);
                      return (
                        <tr key={m.code} className="border-t border-gray-50">
                          <td className="py-1 px-2 font-medium text-gray-700">{m.name}</td>
                          {heatMonths.map(mo=>{
                            const v = RAW[mo.key]?.[m.code]||0;
                            const pct = heatMax>0 ? v/heatMax : 0;
                            const alpha = Math.max(0.08, pct);
                            return (
                              <td key={mo.key} className="py-1 px-1">
                                <div className="rounded-md text-center py-1 text-xs font-semibold"
                                  style={{
                                    backgroundColor: v===0 ? "#f9fafb" : `rgba(99,102,241,${alpha})`,
                                    color: pct > 0.5 ? "white" : pct > 0.1 ? "#4338ca" : "#d1d5db",
                                  }}>
                                  {v>0 ? fmt(v) : "—"}
                                </div>
                              </td>
                            );
                          })}
                          <td className="py-1 px-2 text-right font-bold text-gray-700">฿{fmt(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>น้อย</span>
                {[0.1,0.25,0.5,0.75,1].map((v,i)=>(
                  <div key={i} className="w-8 h-3 rounded" style={{backgroundColor:`rgba(99,102,241,${v})`}}/>
                ))}
                <span>มาก</span>
              </div>
            </div>

            {/* 3. TREEMAP */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                🗂️ Treemap — สัดส่วน Volume Team 5
                <span className="ml-2 text-xs font-normal text-gray-400">({monthLabel?.short || (filter==="all25"?"ปี 2568":"ปี 2569")})</span>
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  nameKey="name"
                  aspectRatio={4/3}
                  content={({ x, y, width, height, name, size, fill }: any) => {
                    if (!width || !height || width < 20 || height < 20) return <g/>;
                    return (
                      <g>
                        <rect x={x+1} y={y+1} width={width-2} height={height-2}
                          fill={fill} rx={4} opacity={0.85}/>
                        {width > 50 && height > 30 && (
                          <text x={x+width/2} y={y+height/2-8} textAnchor="middle"
                            fill="white" fontSize={Math.min(13, width/5)} fontWeight="bold">{name}</text>
                        )}
                        {width > 50 && height > 45 && (
                          <text x={x+width/2} y={y+height/2+8} textAnchor="middle"
                            fill="rgba(255,255,255,0.85)" fontSize={Math.min(11, width/6)}>฿{fmt(size)}</text>
                        )}
                      </g>
                    );
                  }}
                >
                  <Tooltip formatter={(v:number)=>`฿${v.toLocaleString()}`}/>
                </Treemap>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-3">
                {Object.entries(REGION_COLORS).filter(([r])=>r!=="—").map(([r,c])=>(
                  <div key={r} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{backgroundColor:c}}/>
                    <span className="text-xs text-gray-500">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. TREND LINE */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                📈 Trend Line — Top 5 Team 5 (เม.ย. 2568 – ก.ค. 2569)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData} margin={{left:10,right:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis dataKey="month" tick={{fontSize:11}}/>
                  <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                  <Tooltip formatter={(v:number,name:string)=>[`฿${v.toLocaleString()}`,name]}/>
                  <Legend/>
                  {top5Codes.map((p,i)=>(
                    <Line key={p.name} type="monotone" dataKey={p.name}
                      stroke={TREND_COLORS[i]} strokeWidth={2.5}
                      dot={{r:4,fill:TREND_COLORS[i]}}
                      activeDot={{r:6}}
                      connectNulls={false}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* ══ TEAM ══ */}
        {tab==="team" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Volume รายทีม — {monthLabel?.label || (filter==="all25"?"รวมปี 2568":"รวมปี 2569")}
              </h2>
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={teamSingle} layout="vertical" margin={{left:10,right:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis type="number" tick={{fontSize:10}} tickFormatter={fmt}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:12}} width={72}/>
                  <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Volume"]}/>
                  <Bar dataKey="volume" radius={[0,4,4,0]}>
                    {teamSingle.map((t,i)=><Cell key={i} fill={t.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teamSingle.map(t=>{
                const pct=grandTotal>0?((t.volume/grandTotal)*100).toFixed(1):"0";
                return (
                  <div key={t.team} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                        style={{backgroundColor:t.color}}>{t.name.replace("Team ","T")}</div>
                      <span className="text-sm font-bold text-gray-400">{pct}%</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-500 mb-0.5">{t.name}</div>
                    <div className="text-base font-bold mb-1" style={{color:t.color}}>฿{fmt(t.volume)}</div>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{width:`${pct}%`,backgroundColor:t.color}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ TEAM 5 ══ */}
        {tab==="team5" && (
          <div className="space-y-5">
            {/* Sub-tab switcher */}
            <div className="flex gap-2 flex-wrap">
              {([
                {key:"tracker", label:"🚦 Target Tracker"},
                {key:"table",   label:"📋 รายชื่อ & Ranking"},
                {key:"compare", label:"📊 Compare รายช่วงเวลา"},
                {key:"profile", label:"👤 Member Profile"},
              ] as {key:T5SubTab;label:string}[]).map(t=>(
                <button key={t.key} onClick={()=>setT5SubTab(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    t5SubTab===t.key
                      ? t.key==="tracker" ? "bg-rose-600 text-white border-rose-600 shadow"
                        : t.key==="table"   ? "bg-emerald-600 text-white border-emerald-600 shadow"
                        : t.key==="compare" ? "bg-violet-600 text-white border-violet-600 shadow"
                        : "bg-amber-500 text-white border-amber-500 shadow"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}>{t.label}</button>
              ))}
            </div>

            {/* ── TABLE SUB-TAB ── */}
            {t5SubTab==="table" && (<>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="text-xs text-emerald-600 font-medium mb-1">Fee รวม Team 5</div>
                <div className="text-xl font-bold text-emerald-700">฿{fmtFee(toFee(t5Total))}</div>
                <div className="text-xs text-emerald-500 mt-0.5">
                  Vol: ฿{fmt(t5Total)} · {filter==="both"?"2 เดือน":monthLabel?.short}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="text-xs text-emerald-600 font-medium mb-1">สมาชิก</div>
                <div className="text-xl font-bold text-emerald-700">{TEAM5_INFO.length} คน</div>
                <div className="text-xs text-emerald-500 mt-0.5">มียอด {t5Active} คน</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="text-xs text-emerald-600 font-medium mb-1">Fee เฉลี่ยต่อคน</div>
                <div className="text-xl font-bold text-emerald-700">฿{fmtFee(t5Active>0?toFee(t5Total)/t5Active:0)}</div>
                <div className="text-xs text-emerald-500 mt-0.5">เฉพาะที่มียอด</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="text-xs text-emerald-600 font-medium mb-1">🏆 Top Team 5</div>
                <div className="text-xl font-bold text-emerald-700">
                  {team5Data.sort((a,b)=>b.vol-a.vol)[0]?.name || "—"}                </div>
                <div className="text-xs text-emerald-500 mt-0.5">Fee ฿{fmtFee(toFee(t5Top))}</div>
              </div>
            </div>

            {/* Region filter */}
            <div className="flex items-center gap-3 flex-wrap bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
              <span className="text-sm text-gray-600 font-semibold shrink-0 flex items-center gap-1">
                <MapPin size={14}/> ภาค:
              </span>
              <div className="flex gap-2 flex-wrap">
                {regions.map(r=>(
                  <button key={r} onClick={()=>setRegionFilter(r)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all border ${
                      regionFilter===r
                        ? "text-white border-transparent shadow"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                    style={regionFilter===r?{backgroundColor:REGION_COLORS[r]||"#6366f1"}:{}}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Pie + Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">สัดส่วนตามภาค — Team 5</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={regionBreakdown} dataKey="volume" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false}
                      label={({cx,cy,midAngle,innerRadius,outerRadius,name,percent}:any)=>{
                        if(percent<0.06) return null;
                        const R=Math.PI/180,r=innerRadius+(outerRadius-innerRadius)*0.5;
                        return <text x={cx+r*Math.cos(-midAngle*R)} y={cy+r*Math.sin(-midAngle*R)}
                          fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">{name}</text>;
                      }}>
                      {regionBreakdown.map((r,i)=><Cell key={i} fill={r.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v:number)=>`฿${fmt(v)}`}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {regionBreakdown.map(r=>(
                    <div key={r.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:r.color}}/>
                      <span className="text-xs text-gray-500">{r.name}: ฿{fmt(r.volume)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compare bar Team5 */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  {filter==="both"?"ม.ค. vs ก.พ.":monthLabel?.label} — {regionFilter}
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  {filter==="both" ? (
                    <BarChart data={filteredTeam5.filter(m=>m.vol>0)} layout="vertical" margin={{left:5,right:20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis type="number" tick={{fontSize:9}} tickFormatter={fmt}/>
                      <YAxis type="category" dataKey="name" tick={{fontSize:10}} width={65}/>
                      <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Volume"]}/>
                      <Bar dataKey="vol" radius={[0,3,3,0]}>
                        {filteredTeam5.filter(m=>m.vol>0).map((m,i)=>(
                          <Cell key={i} fill={REGION_COLORS[m.region]||"#94a3b8"}/>
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <BarChart data={filteredTeam5.filter(m=>m.vol>0)} layout="vertical" margin={{left:5,right:20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis type="number" tick={{fontSize:9}} tickFormatter={fmt}/>
                      <YAxis type="category" dataKey="name" tick={{fontSize:10}} width={65}/>
                      <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Volume"]}/>
                      <Bar dataKey="vol" radius={[0,3,3,0]}>
                        {filteredTeam5.filter(m=>m.vol>0).map((m,i)=>(
                          <Cell key={i} fill={REGION_COLORS[m.region]||"#94a3b8"}/>
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ranking Table */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={15} className="text-emerald-600"/>
                  รายชื่อ Team 5 — พร้อม Ranking & Target
                </h2>
                <span className="text-xs text-gray-400">{filteredTeam5.length} คน</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-medium">
                      <th className="text-center py-2 px-2 w-8">อันดับ</th>
                      {filter==="both" && <th className="text-center py-2 px-1 w-16">Rank<br/>ม.ค.→ก.พ.</th>}
                      <th className="text-left py-2 px-2">ชื่อ (IC)</th>
                      <th className="text-left py-2 px-2">จังหวัด</th>
                      <th className="text-center py-2 px-2">ภาค</th>
                      <th className="text-right py-2 px-2">Salary Target</th>
                      <th className="text-right py-2 px-2">Fee (Vol×0.966%)</th>
                      <th className="text-right py-2 px-2">Volume</th>
                      <th className="py-2 px-2 w-24">Fee vs Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeam5.map((m, idx) => {
                      const janVol = m.byMonth?.jan || 0;
                      const febVol = m.byMonth?.feb || 0;
                      const janRank = rankMap[m.code]?.jan || 0;
                      const febRank = rankMap[m.code]?.feb || 0;
                      const rankChange = janRank - febRank;
                      const feeVol = toFee(m.vol);
                      const targetPct = m.target>0 ? (feeVol/m.target)*100 : null;
                      const curRank = m.displayRank;
                      const medal = curRank===1?"🥇":curRank===2?"🥈":curRank===3?"🥉":`${curRank}`;
                      return (
                        <tr key={m.code} className={`border-b border-gray-50 hover:bg-gray-50 ${m.vol===0?"opacity-40":""}`}>
                          <td className="py-2 px-2 text-center font-bold">{medal}</td>
                          {filter==="both" && (
                            <td className="py-2 px-1 text-center">
                              <div className="text-gray-400 text-xs">{janRank}→{febRank}</div>
                              {rankChange!==0 && (
                                <div className={`text-xs font-bold flex items-center justify-center gap-0.5 ${rankChange>0?"text-emerald-500":"text-red-500"}`}>
                                  {rankChange>0?<TrendingUp size={9}/>:<TrendingDown size={9}/>}
                                  {rankChange>0?`+${rankChange}`:rankChange}
                                </div>
                              )}
                            </td>
                          )}
                          <td className="py-2 px-2">
                            <div className="font-semibold text-gray-800">{m.name}</div>
                            <div className="text-gray-400 font-mono">{m.ic}</div>
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-gray-300 shrink-0"/>
                              <span className="text-gray-600">{m.province}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
                              style={{backgroundColor:REGION_COLORS[m.region]||"#94a3b8"}}>
                              {m.region}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right text-gray-500">
                            {m.target>0?`฿${m.target.toLocaleString()}`:"—"}
                          </td>
                          <td className="py-2 px-2 text-right text-indigo-600 font-medium">
                            {m.vol>0?`฿${fmtFee(feeVol)}`:"—"}
                          </td>
                          <td className="py-2 px-2 text-right text-gray-400 text-xs">
                            {m.vol>0?`฿${fmt(m.vol)}`:"—"}
                          </td>
                          <td className="py-2 px-2">
                            {targetPct!==null?(
                              <div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div className="h-1.5 rounded-full" style={{
                                    width:`${Math.min(targetPct,100)}%`,
                                    backgroundColor:targetPct>=100?"#10b981":targetPct>=70?"#6366f1":"#f59e0b"
                                  }}/>
                                </div>
                                <div className={`text-right text-xs font-semibold mt-0.5 ${targetPct>=100?"text-emerald-600":targetPct>=70?"text-indigo-600":"text-amber-600"}`}>
                                  {targetPct.toFixed(1)}%
                                </div>
                                <div className="text-right text-gray-300 text-xs">
                                  {fmtFee(feeVol)}/{m.target.toLocaleString()}
                                </div>
                              </div>
                            ):<span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </>)}

            {/* ── COMPARE SUB-TAB ── */}
            {t5SubTab==="compare" && (
              <div className="space-y-5">

                {/* Compare mode selector */}
                <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-gray-700">เปรียบเทียบแบบ:</span>
                    {([
                      {key:"mom",label:"📅 MoM (รายเดือน)"},
                      {key:"qoq",label:"📆 QoQ (รายไตรมาส)"},
                      {key:"hoh",label:"📊 HoH (ครึ่งปี)"},
                      {key:"yoy",label:"🗓️ YoY (รายปี)"},
                    ] as {key:CompareMode;label:string}[]).map(m=>(
                      <button key={m.key} onClick={()=>setCompareMode(m.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          compareMode===m.key
                            ?"bg-violet-600 text-white border-violet-600 shadow"
                            :"bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}>{m.label}</button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{COMPARE_PERIODS[compareMode].label}</p>
                </div>

                {/* Team total bar chart by period */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">
                    📊 ยอดรวม Team 5 — {COMPARE_PERIODS[compareMode].label}
                  </h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={compareData.teamRows} margin={{left:10,right:20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="period" tick={{fontSize:11}}/>
                      <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                      <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Team 5 Volume"]}/>
                      <Bar dataKey="t5total" name="Team 5" radius={[6,6,0,0]}>
                        {compareData.teamRows.map((_,i)=>(
                          <Cell key={i} fill={["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4"][i%5]}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {/* % change badges */}
                  {compareData.teamRows.length >= 2 && (
                    <div className="flex flex-wrap gap-3 mt-3 justify-center">
                      {compareData.teamRows.slice(1).map((row,i)=>{
                        const prev = compareData.teamRows[i].t5total;
                        const cur  = row.t5total;
                        const pct  = prev>0 ? ((cur-prev)/prev)*100 : 0;
                        return (
                          <div key={i} className={`text-xs font-semibold flex items-center gap-1 px-3 py-1 rounded-full ${pct>=0?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>
                            {pct>=0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}
                            {compareData.teamRows[i].period} → {row.period}: {pct>=0?"+":""}{pct.toFixed(1)}%
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Member selector */}
                <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700 shrink-0">👤 เลือกคน:</span>
                    <select
                      value={selectedMember}
                      onChange={e=>setSelectedMember(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      <option value="all">— ดูทุกคนพร้อมกัน —</option>
                      {t5MemberRanked.map(m=>(
                        <option key={m.code} value={m.code}>{m.name} ({m.ic}) · ฿{fmt(m.total)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Individual line trend */}
                {selectedMember !== "all" && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    {(() => {
                      const info = TEAM5_INFO.find(m=>m.code===selectedMember)!;
                      return (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{backgroundColor:REGION_COLORS[info.region]||"#6366f1"}}>
                              {info.name.slice(0,2)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{info.name} <span className="text-gray-400 font-mono text-xs">({info.ic})</span></div>
                              <div className="text-xs text-gray-400">{info.province} · {info.region} · Target ฿{info.target.toLocaleString()}</div>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={memberTrendData} margin={{left:10,right:20}}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                              <XAxis dataKey="period" tick={{fontSize:11}}/>
                              <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                              <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,info.name]}/>
                              <Line type="monotone" dataKey="volume" stroke={REGION_COLORS[info.region]||"#6366f1"}
                                strokeWidth={2.5} dot={{r:5}} activeDot={{r:7}} name={info.name}/>
                            </LineChart>
                          </ResponsiveContainer>
                          {/* % change row */}
                          {memberTrendData.length >= 2 && (
                            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                              {memberTrendData.slice(1).map((row,i)=>{
                                const prev = memberTrendData[i].volume;
                                const cur  = row.volume;
                                const pct  = prev>0 ? ((cur-prev)/prev)*100 : 0;
                                return (
                                  <span key={i} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pct>=0?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>
                                    {memberTrendData[i].period.split(" ")[0]}→{row.period.split(" ")[0]}: {pct>=0?"+":""}{pct.toFixed(1)}%
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* All members stacked/grouped bar */}
                {selectedMember === "all" && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                      📊 ยอดรายคน ทุกคน — {COMPARE_PERIODS[compareMode].label}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400">
                            <th className="text-left py-2 px-2 font-medium w-24">ชื่อ</th>
                            {compareData.periods.map(p=>(
                              <th key={p.name} className="text-right py-2 px-2 font-medium">{p.name}</th>
                            ))}
                            {compareData.periods.length >= 2 &&
                              <th className="text-right py-2 px-2 font-medium text-violet-500">%เปลี่ยน</th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {t5MemberRanked.map(m=>{
                            const vols = compareData.periods.map(p=>
                              p.keys.reduce((s,k)=>s+(RAW[k]?.[m.code]||0),0)
                            );
                            const hasAny = vols.some(v=>v>0);
                            if(!hasAny) return null;
                            const last = vols[vols.length-1];
                            const first = vols[0];
                            const pct = first>0 ? ((last-first)/first)*100 : 0;
                            return (
                              <tr key={m.code} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-2 px-2 font-semibold text-gray-700">
                                  <div>{m.name}</div>
                                  <div className="text-gray-400 font-mono text-xs">{m.region}</div>
                                </td>
                                {vols.map((v,i)=>{
                                  const max = Math.max(...vols);
                                  const pctBar = max>0 ? (v/max)*100 : 0;
                                  return (
                                    <td key={i} className="py-2 px-2">
                                      {v>0?(
                                        <div>
                                          <div className="text-right font-medium text-gray-700">฿{fmt(v)}</div>
                                          <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                                            <div className="h-1 rounded-full bg-violet-400"
                                              style={{width:`${pctBar}%`}}/>
                                          </div>
                                        </div>
                                      ):<span className="text-gray-300 block text-right">—</span>}
                                    </td>
                                  );
                                })}
                                {compareData.periods.length >= 2 && (
                                  <td className={`py-2 px-2 text-right font-semibold ${pct>=0?"text-emerald-600":"text-red-500"}`}>
                                    {first>0?(
                                      <span className="flex items-center justify-end gap-0.5">
                                        {pct>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                                        {pct>=0?"+":""}{pct.toFixed(1)}%
                                      </span>
                                    ):"—"}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ── TRACKER SUB-TAB ── */}
            {t5SubTab==="tracker" && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {label:"🟢 On Target (≥100%)", count:trackerData.filter(m=>m.light==="green").length,  cls:"text-emerald-600 bg-emerald-50 border-emerald-200"},
                    {label:"🟡 ใกล้ถึง (70–99%)",  count:trackerData.filter(m=>m.light==="yellow").length, cls:"text-amber-600 bg-amber-50 border-amber-200"},
                    {label:"🔴 ต้องเร่ง (<70%)",    count:trackerData.filter(m=>m.light==="red").length,    cls:"text-red-600 bg-red-50 border-red-200"},
                  ].map(s=>(
                    <div key={s.label} className={`rounded-2xl p-4 border ${s.cls}`}>
                      <div className="text-2xl font-bold">{s.count} คน</div>
                      <div className="text-xs mt-0.5 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">🚦 Traffic Light — Fee vs Target (ก.ค. 2569)</h2>
                    <span className="text-xs text-gray-400">เรียงตาม % Target</span>
                  </div>
                  <div className="space-y-2">
                    {trackerData.filter(m=>m.light!=="none").map((m,i)=>{
                      const pct = m.targetPct!;
                      const lightColor = m.light==="green"?"bg-emerald-500":m.light==="yellow"?"bg-amber-400":"bg-red-500";
                      const textColor  = m.light==="green"?"text-emerald-700":m.light==="yellow"?"text-amber-700":"text-red-700";
                      const bgColor    = m.light==="green"?"bg-emerald-50":m.light==="yellow"?"bg-amber-50":"bg-red-50";
                      return (
                        <div key={m.code} className={`rounded-xl p-3 ${bgColor} flex items-center gap-3`}>
                          <div className="text-xs text-gray-400 w-5 text-right font-bold">{i+1}</div>
                          <div className={`w-3 h-3 rounded-full shrink-0 ${lightColor}`}/>
                          <div className="w-20 shrink-0">
                            <div className="font-semibold text-gray-800 text-sm">{m.name}</div>
                            <div className="text-xs text-gray-400">{m.region}</div>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-white rounded-full h-3 border border-gray-100">
                              <div className={`h-3 rounded-full ${lightColor}`} style={{width:`${Math.min(pct,100)}%`}}/>
                            </div>
                          </div>
                          <div className={`text-sm font-bold w-16 text-right ${textColor}`}>{pct.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500 w-36 text-right">
                            Fee ฿{fmtFee(m.curFee)} / Target ฿{m.target.toLocaleString()}
                          </div>
                          <button onClick={()=>{ setProfileCode(m.code); setT5SubTab("profile"); }}
                            className="text-xs text-indigo-500 hover:text-indigo-700 underline shrink-0">ดูโปรไฟล์</button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">📈 ยอดขาย + ค่าเฉลี่ยรายคน (ทุกเดือน)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-medium">
                          <th className="text-left py-2 px-2">ชื่อ</th>
                          <th className="text-left py-2 px-2">ภาค</th>
                          <th className="text-right py-2 px-2">ยอดรวม (Vol)</th>
                          <th className="text-right py-2 px-2">Fee รวม</th>
                          <th className="text-right py-2 px-2">เฉลี่ย/เดือน</th>
                          <th className="text-right py-2 px-2">Fee เฉลี่ย/เดือน</th>
                          <th className="text-right py-2 px-2">เดือนที่มียอด</th>
                          <th className="text-right py-2 px-2">Salary Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...trackerData].sort((a,b)=>b.allTotal-a.allTotal).map(m=>(
                          <tr key={m.code} onClick={()=>{ setProfileCode(m.code); setT5SubTab("profile"); }}
                            className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${m.allTotal===0?"opacity-40":""}`}>
                            <td className="py-2 px-2 font-semibold text-gray-800">
                              {m.name} <span className="text-gray-400 font-mono font-normal">({m.ic})</span>
                            </td>
                            <td className="py-2 px-2">
                              <span className="px-2 py-0.5 rounded-full text-white text-xs"
                                style={{backgroundColor:REGION_COLORS[m.region]||"#94a3b8"}}>{m.region}</span>
                            </td>
                            <td className="py-2 px-2 text-right font-medium text-gray-700">฿{fmt(m.allTotal)}</td>
                            <td className="py-2 px-2 text-right text-indigo-600 font-medium">฿{fmtFee(toFee(m.allTotal))}</td>
                            <td className="py-2 px-2 text-right text-gray-600">฿{fmt(m.avgVol)}</td>
                            <td className="py-2 px-2 text-right text-violet-600">฿{fmtFee(m.avgFee)}</td>
                            <td className="py-2 px-2 text-right text-gray-400">{m.activeMonths}/{MONTHS.length}</td>
                            <td className="py-2 px-2 text-right text-gray-500">{m.target>0?`฿${m.target.toLocaleString()}`:"—"}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-indigo-200 bg-indigo-50 font-bold text-indigo-700">
                          <td className="py-2 px-2" colSpan={2}>🟢 Team 5 รวม</td>
                          <td className="py-2 px-2 text-right">฿{fmt(trackerData.reduce((s,m)=>s+m.allTotal,0))}</td>
                          <td className="py-2 px-2 text-right">฿{fmtFee(toFee(trackerData.reduce((s,m)=>s+m.allTotal,0)))}</td>
                          <td className="py-2 px-2 text-right">฿{fmt(trackerData.reduce((s,m)=>s+m.allTotal,0)/MONTHS.length)}</td>
                          <td className="py-2 px-2 text-right">฿{fmtFee(toFee(trackerData.reduce((s,m)=>s+m.allTotal,0)/MONTHS.length))}</td>
                          <td className="py-2 px-2 text-right">—</td>
                          <td className="py-2 px-2 text-right">฿{trackerData.reduce((s,m)=>s+m.target,0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROFILE SUB-TAB ── */}
            {t5SubTab==="profile" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 shrink-0">👤 เลือกสมาชิก:</span>
                  <select value={profileCode} onChange={e=>setProfileCode(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option value="">— เลือกคน —</option>
                    {[...TEAM5_INFO].sort((a,b)=>a.name.localeCompare(b.name,'th')).map(m=>(
                      <option key={m.code} value={m.code}>{m.name} ({m.ic}) · {m.region}</option>
                    ))}
                  </select>
                </div>

                {!profileCode && (
                  <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
                    เลือกชื่อสมาชิกด้านบนเพื่อดูรายละเอียด
                  </div>
                )}

                {profileCode && profileData && (()=>{
                  const { info, monthVols, allTotal, avgVol, best, curFee, targetPct, monthRanks } = profileData;
                  const light = targetPct===null?"none":targetPct>=100?"green":targetPct>=70?"yellow":"red";
                  const lightBg = light==="green"?"bg-emerald-100 text-emerald-700":light==="yellow"?"bg-amber-100 text-amber-700":light==="none"?"bg-gray-100 text-gray-500":"bg-red-100 text-red-700";
                  return (
                    <div className="space-y-5">
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex flex-wrap gap-4 items-start">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                            style={{backgroundColor:REGION_COLORS[info.region]||"#6366f1"}}>
                            {info.name.slice(0,2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xl font-bold text-gray-800">{info.name}</div>
                            <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                              <span>IC: <span className="font-mono font-semibold">{info.ic}</span></span>
                              <span>📍 {info.province}</span>
                              <span>🗺️ {info.region}</span>
                              <span>💰 Salary ฿{info.salary.toLocaleString()}</span>
                              <span>🎯 Target ฿{info.target.toLocaleString()}/เดือน</span>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-xl font-bold text-sm ${lightBg}`}>
                            {light==="green"?"🟢 On Target":light==="yellow"?"🟡 ใกล้ถึง":light==="none"?"⚪ ไม่มี Target":"🔴 ต้องเร่ง"}
                            {targetPct!==null&&<span className="ml-1">({targetPct.toFixed(1)}%)</span>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                          {[
                            {label:"ยอดรวมทุกเดือน",    val:`฿${fmt(allTotal)}`,    sub:`Fee ฿${fmtFee(toFee(allTotal))}`},
                            {label:"เฉลี่ย/เดือน",      val:`฿${fmt(avgVol)}`,      sub:`Fee ฿${fmtFee(toFee(avgVol))}`},
                            {label:"เดือนที่ดีที่สุด", val:best.short,              sub:`฿${fmt(best.vol)}`},
                            {label:"Fee ก.ค. 2569",     val:`฿${fmtFee(curFee)}`,   sub:targetPct!==null?`${targetPct.toFixed(1)}% of Target`:"ไม่มี Target"},
                          ].map((k,i)=>(
                            <div key={i} className="bg-gray-50 rounded-xl p-3">
                              <div className="text-xs text-gray-400 mb-1">{k.label}</div>
                              <div className="font-bold text-gray-800">{k.val}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{k.sub}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">📈 ยอดรายเดือน</h2>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={monthVols} margin={{left:10,right:10}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis dataKey="short" tick={{fontSize:11}}/>
                            <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                            <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Volume"]}/>
                            <Bar dataKey="vol" radius={[4,4,0,0]}>
                              {monthVols.map((m,i)=>(
                                <Cell key={i}
                                  fill={m.vol===best.vol&&m.vol>0?"#f59e0b":m.year===2025?"#a78bfa":"#6366f1"}
                                  opacity={m.vol===0?0.2:1}/>
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs justify-center text-gray-500">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-300 inline-block"/>2568</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-600 inline-block"/>2569</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 inline-block"/>ดีที่สุด</span>
                          <span className="font-semibold text-violet-600">เฉลี่ย ฿{fmt(avgVol)}/เดือน</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">🏅 Rank ในทีม รายเดือน</h2>
                        <div className="flex flex-wrap gap-2">
                          {monthRanks.map(m=>(
                            <div key={m.key} className={`rounded-xl p-3 text-center min-w-[64px] border ${
                              m.rank===0?"border-gray-100 bg-gray-50":m.rank===1?"border-amber-300 bg-amber-50":m.rank<=3?"border-indigo-200 bg-indigo-50":"border-gray-200 bg-white"
                            }`}>
                              <div className="text-xs text-gray-400 mb-1">{m.short}</div>
                              <div className={`text-lg font-bold ${
                                m.rank===0?"text-gray-300":m.rank===1?"text-amber-500":m.rank<=3?"text-indigo-600":"text-gray-700"
                              }`}>
                                {m.rank===0?"—":m.rank===1?"🥇":m.rank===2?"🥈":m.rank===3?"🥉":`#${m.rank}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {info.target > 0 && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                          <h2 className="text-sm font-semibold text-gray-700 mb-4">🎯 Fee vs Target ก.ค. 2569</h2>
                          <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-8 rounded-full flex items-center justify-end pr-3 ${
                              light==="green"?"bg-emerald-500":light==="yellow"?"bg-amber-400":"bg-red-500"
                            }`} style={{width:`${Math.min((targetPct||0),100)}%`}}>
                              <span className="text-white text-sm font-bold">{(targetPct||0).toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Fee ฿{fmtFee(curFee)}</span>
                            <span>Target ฿{info.target.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── COMPARE BY SELECTED MONTHS ── */}
            {t5SubTab==="compare" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700 shrink-0">📅 เลือกเดือน:</span>
                    <span className="text-xs text-gray-400">(เลือกได้หลายเดือน)</span>
                    <button onClick={()=>setCmpMonths(MONTHS.map(m=>m.key))}
                      className="ml-2 px-3 py-1 rounded-lg text-xs border border-dashed border-gray-300 text-gray-400 hover:bg-gray-50">ทั้งหมด</button>
                    <button onClick={()=>setCmpMonths(["jan","feb"])}
                      className="px-3 py-1 rounded-lg text-xs border border-dashed border-indigo-300 text-indigo-500 hover:bg-indigo-50">ปี 2569</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MONTHS.map(m=>{
                      const sel = cmpMonths.includes(m.key);
                      return (
                        <button key={m.key} onClick={()=>{
                          setCmpMonths(prev => sel&&prev.length>1 ? prev.filter(k=>k!==m.key) : !sel ? [...prev,m.key] : prev);
                        }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            sel ? m.year===2025?"bg-violet-600 text-white border-violet-600 shadow":"bg-indigo-600 text-white border-indigo-600 shadow"
                                : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                          }`}>{m.short}</button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">📊 ยอดรวม Team 5</h2>
                  <div className="text-xs text-gray-400 mb-4">
                    รวม: ฿{fmt(cmpMonths.reduce((s,mk)=>s+(cmpTeamTotals[mk]||0),0))} ·
                    เฉลี่ย: ฿{fmt(cmpMonths.reduce((s,mk)=>s+(cmpTeamTotals[mk]||0),0)/Math.max(cmpMonths.length,1))}/เดือน
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={cmpMonths.map(mk=>({
                      month:MONTHS.find(m=>m.key===mk)?.short||mk,
                      vol:cmpTeamTotals[mk]||0,
                    }))} margin={{left:10,right:10}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="month" tick={{fontSize:11}}/>
                      <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                      <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Team 5"]}/>
                      <Bar dataKey="vol" radius={[4,4,0,0]}>
                        {cmpMonths.map((mk,i)=>(
                          <Cell key={i} fill={MONTHS.find(m=>m.key===mk)?.year===2025?"#a78bfa":"#6366f1"}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">👤 ยอดรายคน</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-medium">
                          <th className="text-left py-2 px-2">#</th>
                          <th className="text-left py-2 px-2">ชื่อ</th>
                          <th className="text-left py-2 px-2">ภาค</th>
                          {cmpMonths.map(mk=>(
                            <th key={mk} className="text-right py-2 px-2">{MONTHS.find(m=>m.key===mk)?.short||mk}</th>
                          ))}
                          <th className="text-right py-2 px-2 border-l border-gray-100 text-indigo-500">รวม</th>
                          <th className="text-right py-2 px-2 text-violet-500">เฉลี่ย/เดือน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cmpData.filter(m=>m.total>0).map((m,i)=>{
                          const vols = cmpMonths.map(mk=>m.vols[mk]||0);
                          const maxV = Math.max(...vols,1);
                          const avg  = m.total/Math.max(cmpMonths.length,1);
                          return (
                            <tr key={m.code} onClick={()=>{ setProfileCode(m.code); setT5SubTab("profile"); }}
                              className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                              <td className="py-2 px-2 text-gray-400">{i+1}</td>
                              <td className="py-2 px-2">
                                <div className="font-semibold text-gray-800">{m.name}</div>
                                <div className="text-gray-400 font-mono">{m.ic}</div>
                              </td>
                              <td className="py-2 px-2">
                                <span className="px-1.5 py-0.5 rounded-full text-white text-xs"
                                  style={{backgroundColor:REGION_COLORS[m.region]||"#94a3b8"}}>{m.region}</span>
                              </td>
                              {vols.map((v,j)=>(
                                <td key={j} className="py-2 px-2 text-right">
                                  {v>0?(
                                    <div>
                                      <div className={`font-medium ${v===maxV?"text-amber-600 font-bold":"text-gray-700"}`}>฿{fmt(v)}</div>
                                      <div className="w-full bg-gray-100 h-1 rounded mt-0.5">
                                        <div className="h-1 rounded bg-violet-400" style={{width:`${(v/maxV)*100}%`}}/>
                                      </div>
                                    </div>
                                  ):<span className="text-gray-200">—</span>}
                                </td>
                              ))}
                              <td className="py-2 px-2 text-right border-l border-gray-100 font-bold text-indigo-700">฿{fmt(m.total)}</td>
                              <td className="py-2 px-2 text-right text-violet-600">฿{fmt(avg)}</td>
                            </tr>
                          );
                        })}
                        <tr className="border-t-2 border-violet-200 bg-violet-50 font-bold text-violet-700">
                          <td colSpan={3} className="py-2 px-2">🟢 Team 5 รวม / เฉลี่ย</td>
                          {cmpMonths.map(mk=>{
                            const mv = cmpTeamTotals[mk]||0;
                            const ac = TEAM5_INFO.filter(m=>(RAW[mk]?.[m.code]||0)>0).length;
                            return (
                              <td key={mk} className="py-2 px-2 text-right text-xs">
                                <div>฿{fmt(mv)}</div>
                                <div className="font-normal text-violet-400">avg ฿{fmt(ac>0?mv/ac:0)}</div>
                              </td>
                            );
                          })}
                          <td className="py-2 px-2 text-right border-l border-violet-200">
                            ฿{fmt(cmpMonths.reduce((s,mk)=>s+(cmpTeamTotals[mk]||0),0))}
                          </td>
                          <td className="py-2 px-2 text-right">
                            ฿{fmt(cmpMonths.reduce((s,mk)=>s+(cmpTeamTotals[mk]||0),0)/Math.max(cmpMonths.length,1))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Period compare MoM/QoQ/HoH/YoY */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">⚖️ เปรียบเทียบช่วงเวลา</h2>
                    {([
                      {key:"mom",label:"📅 MoM"},
                      {key:"qoq",label:"📆 QoQ"},
                      {key:"hoh",label:"📊 HoH"},
                      {key:"yoy",label:"🗓️ YoY"},
                    ] as {key:CompareMode;label:string}[]).map(m=>(
                      <button key={m.key} onClick={()=>setCompareMode(m.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          compareMode===m.key?"bg-violet-600 text-white border-violet-600 shadow":"bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}>{m.label}</button>
                    ))}
                  </div>
                  {/* team total bar */}
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={compareData.teamRows} margin={{left:10,right:10}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="period" tick={{fontSize:10}}/>
                      <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
                      <Tooltip formatter={(v:number)=>[`฿${v.toLocaleString()}`,"Team 5"]}/>
                      <Bar dataKey="t5total" radius={[4,4,0,0]}>
                        {compareData.teamRows.map((_,i)=>(
                          <Cell key={i} fill={["#6366f1","#10b981","#f59e0b","#f43f5e"][i%4]}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {compareData.teamRows.length>=2 && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                      {compareData.teamRows.slice(1).map((row,i)=>{
                        const prev=compareData.teamRows[i].t5total, cur=row.t5total;
                        const pct=prev>0?((cur-prev)/prev)*100:0;
                        return (
                          <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${pct>=0?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>
                            {pct>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                            {compareData.teamRows[i].period.split(" ")[0]}→{row.period.split(" ")[0]}: {pct>=0?"+":""}{pct.toFixed(1)}%
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {/* per-member table */}
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-medium">
                          <th className="text-left py-2 px-2">ชื่อ</th>
                          {compareData.periods.map(p=><th key={p.name} className="text-right py-2 px-2">{p.name.split(" ")[0]}</th>)}
                          {compareData.periods.length>=2&&<th className="text-right py-2 px-2 text-violet-500">%เปลี่ยน</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {t5MemberRanked.map(m=>{
                          const vols=compareData.periods.map(p=>p.keys.reduce((s,k)=>s+(RAW[k]?.[m.code]||0),0));
                          if(!vols.some(v=>v>0)) return null;
                          const first=vols[0], last=vols[vols.length-1];
                          const pct=first>0?((last-first)/first)*100:0;
                          return (
                            <tr key={m.code} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                              onClick={()=>{setProfileCode(m.code);setT5SubTab("profile");}}>
                              <td className="py-2 px-2 font-semibold text-gray-800">{m.name}</td>
                              {vols.map((v,i)=><td key={i} className="py-2 px-2 text-right text-gray-700">{v>0?`฿${fmt(v)}`:"—"}</td>)}
                              {compareData.periods.length>=2&&(
                                <td className={`py-2 px-2 text-right font-semibold ${pct>=0?"text-emerald-600":"text-red-500"}`}>
                                  {first>0?(
                                    <span className="flex items-center justify-end gap-0.5">
                                      {pct>=0?<TrendingUp size={9}/>:<TrendingDown size={9}/>}
                                      {pct>=0?"+":""}{pct.toFixed(1)}%
                                    </span>
                                  ):"—"}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <div className="text-center text-xs text-gray-400 pb-4">
          Globlex Securities Co., Ltd. · #Wealth 4 · เม.ย. 2568 – ก.ค. 2569
        </div>
      </div>
    </div>
  );
}
