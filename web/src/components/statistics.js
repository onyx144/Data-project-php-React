import React from 'react';

function Statistics({ stats }) {
  return (
    <div>
      <h2>Статистика котирувань</h2>
      <p>Середнє: {stats.average}</p>
      <p>Стандартне відхилення: {stats.deviation}</p>
      <p>Мода: {stats.mode}</p>
      <p>Мінімум: {stats.min}</p>
      <p>Максимум: {stats.max}</p>
      <p>Загальна кількість котирувань: {stats.totalQuotes}</p>
      <p>Дата/час: {stats.timestamp}</p>
    </div>
  );
}

export default Statistics;
