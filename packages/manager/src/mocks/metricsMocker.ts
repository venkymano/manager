import { convertTimeDurationToStartAndEndTimeRange } from 'src/features/CloudView/Utils/CloudPulseUtils';

export const getMetricsResponse = (requestBody: any) => {
  if (
    requestBody.time_granularity.unit == 'min' &&
    requestBody.time_granularity.value == '1'
  ) {
    // one type of response
    // Instead of setting data statically, we can get and set from API call
    return {
      data: {
        result: [
          {
            metric: {
              state:
                requestBody.metric == 'system_cpu_utilization_percent'
                  ? 'dbass1'
                  : 'Aggregated Resources',
            },
            values:
              requestBody.metric == 'system_cpu_utilization_percent'
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      60,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      4,
                      true,
                      2
                    ),
                  ]
                : requestBody.metric == 400
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      60,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      6,
                      true,
                      3
                    ),
                  ]
                : [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      60,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      8,
                      true,
                      1
                    ),
                  ],
          },
          requestBody.metric == 'system_cpu_utilization_percent'
            ? {
                metric: {
                  state: 'dbass2',
                },
                values:
                  requestBody.metric == 200
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          5
                        ),
                      ]
                    : requestBody.metric == 400
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          7
                        ),
                      ]
                    : [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          9
                        ),
                      ],
              }
            : undefined,
          requestBody.metric == 'system_cpu_utilization_percent'
            ? {
                metric: {
                  state: 'dbass3',
                },
                values:
                  requestBody.metric == 200
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          5,
                          true,
                          2
                        ),
                      ]
                    : requestBody.metric == 400
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          7,
                          true,
                          2
                        ),
                      ]
                    : [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          9,
                          true,
                          2
                        ),
                      ],
              }
            : undefined,
          //   {
          //     metric: {
          //       state: 'dimension3',
          //     },
          //     values: getArrayData(
          //       6,
          //       1000,
          //       requestBody.startTime,
          //       requestBody.endTime
          //     ),
          //   },
        ],
        resultType: 'matrix',
      },
      isPartial: false,
      stats: {
        seriesFetched: '8',
      },
      status: 'success',
    };
  }

  if (
    requestBody.time_granularity.unit == 'min' &&
    requestBody.time_granularity.value == '1'
  ) {
    // one type of response
    // Instead of setting data statically, we can get and set from API call
    return {
      data: {
        result: [
          {
            metric: {
              state:
                requestBody.metric == 'system_cpu_utilization_percent'
                  ? 'dbass1'
                  : 'Aggregated Resources',
            },
            values:
              requestBody.metric == 'system_cpu_utilization_percent'
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      60,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      4,
                      true,
                      2
                    ),
                  ]
                : requestBody.metric == 400
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      60,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      6,
                      true,
                      3
                    ),
                  ]
                : [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      60,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      8,
                      true,
                      1
                    ),
                  ],
          },
          requestBody.metric == 'system_cpu_utilization_percent'
            ? {
                metric: {
                  state: 'dbass2',
                },
                values:
                  requestBody.metric == 200
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          5
                        ),
                      ]
                    : requestBody.metric == 400
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          7
                        ),
                      ]
                    : [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          9
                        ),
                      ],
              }
            : undefined,
          requestBody.metric == 'system_cpu_utilization_percent'
            ? {
                metric: {
                  state: 'dbass3',
                },
                values:
                  requestBody.metric == 200
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          5,
                          true,
                          2
                        ),
                      ]
                    : requestBody.metric == 400
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          7,
                          true,
                          2
                        ),
                      ]
                    : [
                        ...getArrayDataRandomIncrementAndDecrement(
                          5,
                          60,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          9,
                          true,
                          2
                        ),
                      ],
              }
            : undefined,
          //   {
          //     metric: {
          //       state: 'dimension2',
          //     },
          //     values:
          //       requestBody.metric == 200
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               3,
          //               1000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               8
          //             ),
          //           ]
          //         : requestBody.metric == 400
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               3,
          //               1000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               10
          //             ),
          //           ]
          //         : [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               3,
          //               1000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               12
          //             ),
          //           ],
          //   },
          //   {
          //     metric: {
          //       state: 'dimension3',
          //     },
          //     values: getArrayData(
          //       6,
          //       1000,
          //       requestBody.startTime,
          //       requestBody.endTime
          //     ),
          //   },
        ],
        resultType: 'matrix',
      },
      isPartial: false,
      stats: {
        seriesFetched: '8',
      },
      status: 'success',
    };
  }

  if (
    requestBody.time_granularity.unit == 'min' &&
    requestBody.time_granularity.value == '5'
  ) {
    // one type of response
    return {
      data: {
        result: [
          {
            metric: {
              state:
                requestBody.metric == 'system_cpu_utilization_percent'
                  ? 'dbass1'
                  : 'Aggregated Resources',
            },
            values:
              requestBody.metric == 'system_cpu_utilization_percent'
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      1,
                      300,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      8,
                      true,
                      1
                    ),
                  ]
                : requestBody.metric == 400
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      1,
                      300,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      10,
                      true,
                      2
                    ),
                  ]
                : [
                    ...getArrayDataRandomIncrementAndDecrement(
                      1,
                      300,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      12,
                      true,
                      4
                    ),
                  ],
          },
          requestBody.metric == 'system_cpu_utilization_percent'
            ? {
                metric: {
                  state: 'dbass2',
                },
                values:
                  requestBody.metric == 'system_cpu_utilization_percent'
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          3,
                          300,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          5
                        ),
                      ]
                    : requestBody.metric == 400
                    ? [
                        ...getArrayDataRandomIncrementAndDecrement(
                          3,
                          300,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          7
                        ),
                      ]
                    : [
                        ...getArrayDataRandomIncrementAndDecrement(
                          3,
                          300,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).start,
                          convertTimeDurationToStartAndEndTimeRange(
                            requestBody.relative_time_duration
                          ).end,
                          9
                        ),
                      ],
              }
            : undefined,
          //   {
          //     metric: {
          //       state: 'dimension2',
          //     },
          //     values: getArrayData(
          //       9,
          //       5000,
          //       requestBody.startTime,
          //       requestBody.endTime
          //     ),
          //   },
          //   {
          //     metric: {
          //       state: 'dimension3',
          //     },
          //     values:
          //       requestBody.metric == 200
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               4,
          //               2500,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               4
          //             ),
          //           ]
          //         : requestBody.metric == 400
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               4,
          //               2500,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               12
          //             ),
          //           ]
          //         : [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               4,
          //               2500,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               20
          //             ),
          //           ],
          //   },
        ],
        resultType: 'matrix',
      },
      isPartial: false,
      stats: {
        seriesFetched: '8',
      },
      status: 'success',
    };
  }

  if (
    requestBody.time_granularity.unit == 'hr' &&
    requestBody.time_granularity.value == '2'
  ) {
    // one type of response
    return {
      data: {
        result: [
          {
            metric: {
              state:
                requestBody.metric == 'system_cpu_utilization_percent'
                  ? 'dbass3'
                  : 'Aggregated Resources',
            },
            values:
              requestBody.metric == 200
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      9,
                      7200,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      5,
                      true,
                      2
                    ),
                  ]
                : requestBody.metric == 'system_cpu_utilization_percent'
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      9,
                      7200,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      10,
                      true,
                      1
                    ),
                  ]
                : [
                    ...getArrayDataRandomIncrementAndDecrement(
                      9,
                      7200,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      15,
                      true,
                      4
                    ),
                  ],
          },
          //   {
          //     metric: {
          //       state: 'dimension2',
          //     },
          //     values: getArrayDataRandomIncrementAndDecrement(
          //       7,
          //       50000,
          //       requestBody.startTime,
          //       requestBody.endTime,
          //       3
          //     ),
          //   },
          //   {
          //     metric: {
          //       state: 'dimension3',
          //     },
          //     values: getArrayData(
          //       5,
          //       50000,
          //       requestBody.startTime,
          //       requestBody.endTime
          //     ),
          //   },
        ],
        resultType: 'matrix',
      },
      isPartial: false,
      stats: {
        seriesFetched: '8',
      },
      status: 'success',
    };
  }

  if (
    requestBody.time_granularity.unit == 'day' &&
    requestBody.time_granularity.value == '1'
  ) {
    // one type of response
    return {
      data: {
        result: [
          {
            metric: {
              state:
                requestBody.metric == 'system_cpu_utilization_percent'
                  ? 'dbass1'
                  : 'Aggregated Resources',
            },
            values:
              requestBody.metric == 'system_cpu_utilization_percent'
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      86400,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      6,
                      true,
                      3
                    ),
                  ]
                : requestBody.metric == 400
                ? [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      86400,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).start,
                      convertTimeDurationToStartAndEndTimeRange(
                        requestBody.relative_time_duration
                      ).end,
                      12,
                      true,
                      1
                    ),
                  ]
                : [
                    ...getArrayDataRandomIncrementAndDecrement(
                      3,
                      86400,
                      requestBody.startTime,
                      requestBody.endTime,
                      18,
                      true,
                      5
                    ),
                  ],
          },
          //   {
          //     metric: {
          //       state: 'dimension2',
          //     },
          //     values:
          //       requestBody.metric == 200
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               10,
          //               150000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               3
          //             ),
          //           ]
          //         : requestBody.metric == 400
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               10,
          //               150000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               4
          //             ),
          //           ]
          //         : [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               10,
          //               150000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               5
          //             ),
          //           ],
          //   },
          //   {
          //     metric: {
          //       state: 'dimension3',
          //     },
          //     values:
          //       requestBody.metric == 200
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               2,
          //               150000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               7
          //             ),
          //           ]
          //         : requestBody.metric == 400
          //         ? [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               2,
          //               150000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               14
          //             ),
          //           ]
          //         : [
          //             ...getArrayDataRandomIncrementAndDecrement(
          //               2,
          //               150000,
          //               requestBody.startTime,
          //               requestBody.endTime,
          //               21
          //             ),
          //           ],
          //   },
        ],
        resultType: 'matrix',
      },
      isPartial: false,
      stats: {
        seriesFetched: '8',
      },
      status: 'success',
    };
  }

  return {};
};

const getArrayDataRandomIncrementAndDecrement = (
  incrementer: number,
  interval: number,
  start: number,
  end: number,
  incrementSwitcher: number,
  decNeeded?: boolean,
  decValue?: number
) => {
  const arrayData: Array<number[]> = [];
  let j = 1;
  let increment = true;
  let lastPoint = start + incrementSwitcher * interval;
  for (let i = start; i < end; i = i + interval) {
    const element: number[] = [];
    element[0] = i;
    if (increment) {
      element[1] = j + incrementer;
      j = j + incrementer;

      if (i >= lastPoint) {
        increment = false;
        lastPoint = i + 2 * interval;
      }
    } else {
      element[1] = j - incrementer;
      j = j - incrementer;
      if (i >= lastPoint) {
        increment = true;
        lastPoint = i + incrementSwitcher * interval;
      }
    }
    arrayData.push(element);
  }

  if (decNeeded) {
    return randomDecrements(arrayData, decValue ? decValue : 2);
  }
  return arrayData;
};

const randomDecrements = (arrayData: Array<number[]>, decValue: number) => {
  const mid = Math.round(arrayData.length / 2);

  for (let i = mid; i < arrayData.length; i++) {
    arrayData[i][1] =
      arrayData[i - 1][1] - decValue <= 0
        ? arrayData[i - 1][1]
        : arrayData[i - 1][1] - decValue;
  }

  return arrayData;
};
