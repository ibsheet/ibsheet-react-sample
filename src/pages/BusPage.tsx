import React, { useMemo, useRef, useCallback } from 'react';
import { IBSheetReact, type IBSheetInstance, type IBSheetOptions, type IBSheetEvents } from '@ibsheet/react';

type SearchFinishEvent = Parameters<NonNullable<IBSheetEvents['onSearchFinish']>>[0];

const SHEET_COLS = [
  { Header: "정류장ID", Name: "nodeId", Type: "Text", MinWidth: 120 },
  { Header: "정류장명", Name: "nodeNm", Type: "Text", Align: "Center", NumberSort: true, MinWidth: 150, RelWidth: 1 },
  { Header: "노선명", Name: "routeNm", Type: "Text", Align: "Center" },
  { Header: "노선유형", Name: "routeTy", Type: "Enum", EnumKeys: "|1|2|3|4|5|6|7|8|10", Enum: "|공항|마을|간선|지선|순환|광역|인천|경기|관광" },
  { Header: "승차인원", Name: "tkcarNmpr", Type: "Int" },
  { Header: "하차인원", Name: "gffNmpr", Type: "Int" },
  { Header: "재차인원", Name: "nownmprNmpr", Type: "Int" },
  { Header: "구간명", Name: "sctnNm", Type: "Text", Align: "Center" },
  { Header: "구간거리", Name: "sctnDstnc", Type: "Float", Align: "Center", MinWidth: 200, RelWidth: 1 },
  { Header: "기준일자", Name: "stdrDe", Type: "Date", DataFormat: "yyyyMMdd", Format: "yyyy-MM-dd" },
];

export const BusPage: React.FC = React.memo(() => {
  const sheetRef = useRef<IBSheetInstance | null>(null);

  const sheetOptions = useMemo<IBSheetOptions>(() => ({
    Cfg: {
      SearchMode: 0,
    },
    LeftCols: [
      { Type: "Int", Width: 80, Align: "Center", Name: "SEQ" }
    ],
    Cols: SHEET_COLS,
    Events: {
      onSearchFinish: (evt: SearchFinishEvent) => {
        evt.sheet.showFilterRow();
      }
    }
  }), []);

  const sheetStyle = useMemo(() => ({
    width: '100%',
    height: '350px'
  }), []);

  const dataLoad = useCallback(async () => {
    if (!sheetRef.current) {
      console.error('Sheet instance is not ready.');
      return;
    }
    try {
      const res = await fetch('/assets/json/bus_traffic.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      sheetRef.current.loadSearchData(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  return (
    <div>
      <p>서울시 정류장 운행 통계 (25.08.05)</p>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={dataLoad}>데이터 조회</button>
      </div>

      <IBSheetReact
        ref={sheetRef}
        options={sheetOptions}
        style={sheetStyle}
      />
    </div>
  );
});

BusPage.displayName = 'BusPage';
