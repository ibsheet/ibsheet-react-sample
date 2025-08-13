import React, { useState, useMemo, useRef, useCallback } from 'react';
import { IBSheetReact, type IBSheetInstance, type IBSheetOptions, type IBSheetEvents } from '@ibsheet/react';
import styles from './FlightPage.module.scss';

type DataRow = { [key: string]: string | number; };
type ReceiveDataEvent = Parameters<NonNullable<IBSheetEvents['onReceiveData']>>[0];

const FLIGHT_OPTIONS = [
  { code: 'country', val: '국가별 항공통계-운항편' },
  { code: 'passenger', val: '국가별 항공통계-여객' },
  { code: 'cargo', val: '국가별 항공통계-화물' }
];

const COUNTRY_COLS = [
  { Header: '지역 구분명', Name: 'region', Type: "Text", Align: "Center" },
  { Header: '국가명', Name: 'country', Type: "Text", RelWidth: 1, MinWidth: 150 },
  { Header: '출발편수(편)', Name: 'depFlight', Type: 'Int', Width: 150 },
  { Header: '도착편수(편)', Name: 'arrFlight', Type: 'Int', Width: 150 },
  { Header: '합계편수(편)', Name: 'flights', Type: 'Int', Width: 150 },
];

const PASSENGER_COLS = [
  { Header: '지역 구분명', Name: 'region', Type: "Text", Align: "Center" },
  { Header: '국가명', Name: 'country', Type: "Text", RelWidth: 1, MinWidth: 150 },
  { Header: '출발승객수(명)', Name: 'depPassenger', Type: 'Int', Width: 150 },
  { Header: '도착승객수(명)', Name: 'arrPassenger', Type: 'Int', Width: 150 },
  { Header: '합계승객수(명)', Name: 'passenger', Type: 'Int', Width: 150 },
];

const CARGO_COLS = [
  { Header: '지역 구분명', Name: 'region', Type: "Text", Align: "Center" },
  { Header: '국가명', Name: 'country', Type: "Text", RelWidth: 1, MinWidth: 150 },
  { Header: '출발화물(톤)', Name: 'depBaggage', Type: 'Int', Width: 150 },
  { Header: '도착화물(톤)', Name: 'arrBaggage', Type: 'Int', Width: 150 },
  { Header: '합계화물(톤)', Name: 'baggage', Type: 'Int', Width: 150 },
];

const processReceivedData = (data: unknown, keys: string[]): DataRow[] => {
  if (!data) return [];

  let processed: DataRow[];

  if (typeof data === 'string') {
    try {
      processed = JSON.parse(data);
    } catch {
      return [];
    }
  } else if (Array.isArray(data)) {
    processed = data;
  } else {
    return [];
  }

  if (!Array.isArray(processed)) return [];

  processed.forEach((row: DataRow) => {
    keys.forEach(key => {
      const value = row[key];
      if (typeof value === 'string') {
        row[key] = value.replaceAll(',', '');
      }
    });
  });

  return processed;
};

const countryEventHandler = (evt: ReceiveDataEvent) => processReceivedData(evt.data, ['depFlight', 'arrFlight', 'flights']);
const passengerEventHandler = (evt: ReceiveDataEvent) => processReceivedData(evt.data, ['depPassenger', 'arrPassenger', 'passenger']);
const cargoEventHandler = (evt: ReceiveDataEvent) => processReceivedData(evt.data, ['depBaggage', 'arrBaggage', 'baggage']);

export const FlightPage: React.FC = React.memo(() => {
  const [selectedCode, setSelectedCode] = useState(FLIGHT_OPTIONS[0].code);
  const [sheetVisible, setSheetVisible] = useState(true);

  const sheetRef = useRef<IBSheetInstance | null>(null);

  const sheetOptions = useMemo<IBSheetOptions>(() => {
    const getColsByCode = (code: string) => {
      switch (code) {
        case 'country': return COUNTRY_COLS;
        case 'passenger': return PASSENGER_COLS;
        case 'cargo': return CARGO_COLS;
        default: return COUNTRY_COLS;
      }
    };
    return {
      Cfg: { SearchMode: 2 },
      Cols: getColsByCode(selectedCode)
    };
  }, [selectedCode]);

  const onInstance = useCallback((sheet: IBSheetInstance) => {
    let eventHandler;
    switch (selectedCode) {
      case 'country': eventHandler = countryEventHandler; break;
      case 'passenger': eventHandler = passengerEventHandler; break;
      case 'cargo': eventHandler = cargoEventHandler; break;
      default: eventHandler = countryEventHandler;
    }
    sheet.bind('onReceiveData', eventHandler);
  }, [selectedCode]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    sheetRef.current = null;
    
    setSheetVisible(false);
    setSelectedCode(newCode);
    setTimeout(() => {
      setSheetVisible(true);
    }, 0);
  };

  const handleDataLoad = useCallback(async () => {
    if (!sheetRef.current) { console.error("Sheet instance is not available."); return; }
    try {
      const dataPath = `assets/json/flight_${selectedCode}.json`;
      const response = await fetch(dataPath);
      if (!response.ok) { throw new Error(`Failed to fetch data from ${dataPath}`); }
      const data = await response.json();
      sheetRef.current.loadSearchData(data);
    } catch (error) {
      console.error("Data loading failed:", error);
    }
  }, [selectedCode]);

  return (
    <div>
      <p>인천국제공항공사_국가별 항공 통계 서비스 (25.08.08)</p>

      <div className={styles.controlBar}>
        <select value={selectedCode} onChange={handleSelectChange}>
          {FLIGHT_OPTIONS.map(flight => (
            <option key={flight.code} value={flight.code}>{flight.val}</option>
          ))}
        </select>
        <button onClick={handleDataLoad}>데이터 조회</button>
      </div>
      
      {sheetVisible && (
        <IBSheetReact
        ref={sheetRef}
          options={sheetOptions}
          style={{ width: '100%', height: '350px' }}
          instance={onInstance}
        />
      )}
    </div>
  );
});

FlightPage.displayName = 'FlightPage';
