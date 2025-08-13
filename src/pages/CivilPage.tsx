import React, { useMemo, useRef, useCallback } from 'react';
import { IBSheetReact, type IBSheetInstance, type IBSheetOptions } from '@ibsheet/react';

const SHEET_COLS = [
  { Header: '관리번호', Name: 'managerment_number', Type: 'Text', Width: 150 },
  { Header: '지정일자', Name: 'designated_date', Type: 'Date', Width: 150, DataFormat: "yyyy-MM-dd" },
  { Header: '해제일자', Name: 'release_date', Type: 'Date', Width: 150, DataFormat: "yyyy-MM-dd" },
  { Header: '운영상태', Name: 'status', Type: 'Text', Width: 100, Align: "Center" },
  { Header: '시설명', Name: 'facility_name', Type: 'Text', Width: 250 },
  { Header: '시설구분', Name: 'facility_type', Type: 'Text', Width: 150, Align: "Center" },
  { Header: '도로명전체주소', Name: 'addr_doro', Type: 'Text', MinWidth: 300, RelWidth: 1 },
  { Header: '소재지전체주소', Name: 'addr_jibun', Type: 'Text', MinWidth: 300, RelWidth: 1 },
  { Header: '도로명우편번호', Name: 'post_no_doro', Type: 'Text', Width: 100, Align: "Center" },
  { Header: '시설위치(지상/지하)', Name: 'facility_location', Type: 'Text', Width: 150, Align: "Center" },
  { Header: '시설면적(㎡)', Name: 'facility_area', Type: 'Text', Width: 150, Align: "Center" },
  { Header: '최대수용인원', Name: 'maximum_capacity', Type: 'Text', Width: 150, Align: "Center" },
  { Header: '위도 (GPS)', Name: 'latitude_epsg4326', Type: 'Text', Width: 150 },
  { Header: '경도 (GPS)', Name: 'longitude_epsg4326', Type: 'Text', Width: 150 }
];

export const CivilPage: React.FC = React.memo(() => {
  const sheetRef = useRef<IBSheetInstance | null>(null);

  const sheetOption = useMemo<IBSheetOptions>(() => ({
    Cfg: {
      SearchMode: 2
    },
    LeftCols: [
      { Type: "Int", Width: 100, Align: "Center", Name: "SEQ" }
    ],
    Cols: SHEET_COLS
  }), []);

  // 데이터 로드
  const dataLoad = useCallback(async () => {
    if (!sheetRef.current) {
      console.error('Sheet instance is not ready.');
      return;
    }
    try {
      const res = await fetch('/assets/json/civil_defense_shelter.json');
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
      <p>행정안전부_민방위대피시설 (24.03.19)</p>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={dataLoad}>데이터 조회</button>
      </div>

      <IBSheetReact
        ref={sheetRef}
        options={sheetOption}
        style={{ width: '100%', height: 350 }}
      />
    </div>
  );
});

CivilPage.displayName = 'CivilPage';
