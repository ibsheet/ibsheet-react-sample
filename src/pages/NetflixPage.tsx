import React, { useMemo, useRef, useCallback } from 'react';
import { IBSheetReact, type IBSheetInstance, type IBSheetOptions, type IBSheetEvents } from '@ibsheet/react';

const SHEET_COLS = [
  { Header: "국가", Name: "n_country", Type: "Html", Width: 250, TextSize: '18px', TextFont: "Inter var,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", Color: "#1f2937", TextColor: "white", CanFocus: 0 },
  { Header: "최고인기 영화", Name: "n_topMovie", Type: "Html", MinWidth: 350, RelWidth: 1, TextSize: '18px', TextFont: "Inter var,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", Color: "#1f2937", TextColor: "white", CanFocus: 0 },
  { Header: "최고인기 TV방송", Name: "n_topTvShow", Type: "Html", MinWidth: 350, RelWidth: 1, TextSize: '18px', TextFont: "Inter var,ui-sans-serif,system-ui,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'", Color: "#1f2937", TextColor: "white", CanFocus: 0 },
];

type NetflixDataRow = {
  countryFlagImage: string;
  country: string;
  topMovieImage: string;
  topMovie: string;
  topTvShowImage: string;
  topTvShow: string;
  n_country?: string;
  n_topMovie?: string;
  n_topTvShow?: string;
};

type ReceiveDataEvent = Parameters<NonNullable<IBSheetEvents['onReceiveData']>>[0];

const handleReceiveData = (evt: ReceiveDataEvent): NetflixDataRow[] => {
  const data = evt.data;
  if (!data) return [];

  let processedData: NetflixDataRow[];
  if (typeof data === 'string') {
    try {
      processedData = JSON.parse(data);
    } catch {
      return [];
    }
  } else if (Array.isArray(data)) {
    processedData = data;
  } else {
    return [];
  }

  if (!Array.isArray(processedData)) return [];

  processedData.forEach(row => {
    const countrySpt = row.countryFlagImage?.split('|');
    if (countrySpt && countrySpt.length > 1) {
      row.n_country = `<img border="0" draggable="false" width="20px" src="${countrySpt[1]}"> ${row.country}`;
    }

    const movieSpt = row.topMovieImage?.split('|');
    if (movieSpt && movieSpt.length > 1) {
      row.n_topMovie = `<img border="0" draggable="false" width="40px" src="${movieSpt[1]}"> ${row.topMovie}`;
    }

    const tvSpt = row.topTvShowImage?.split('|');
    if (tvSpt && tvSpt.length > 1) {
      row.n_topTvShow = `<img border="0" draggable="false" width="40px" src="${tvSpt[1]}"> ${row.topTvShow}`;
    }
  });

  return processedData;
};

export const NetflixPage: React.FC = React.memo(() => {
  const sheetRef = useRef<IBSheetInstance | null>(null);

  const dataLoad = useCallback(async () => {
    if (!sheetRef.current) {
      console.error('Sheet instance is not ready.');
      return;
    }
    try {
      const res = await fetch('/assets/json/netflix_favorite.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      sheetRef.current.loadSearchData(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  const sheetOptions = useMemo<IBSheetOptions>(() => ({
    Cfg: {
      SearchMode: 2,
      NoVScroll: true,
      CanEdit: 0,
      HeaderMerge: 5,
    },
    Cols: SHEET_COLS,
    Events: {
      onReceiveData: handleReceiveData,
      onRenderFirstFinish: () => {
        dataLoad();
      }
    }
  }), [dataLoad]);

  const sheetStyle = useMemo(() => ({
    width: '100%',
    height: '500px'
  }), []);

  return (
    <div>
      <p>넷플릭스 국가별 최고인기 작품 (영화, TV) (2025년 8월 8일 기준 by https://flixpatrol.com/)</p>
      <IBSheetReact
        ref={sheetRef}
        options={sheetOptions}
        style={sheetStyle}
      />
    </div>
  );
});

NetflixPage.displayName = 'NetflixPage';
