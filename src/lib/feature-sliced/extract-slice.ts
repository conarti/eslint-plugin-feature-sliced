import {
  layersWithSlices,
  segments,
} from '../../config';

/**
 * Извлекает slice из пути.
 *
 * Эвристика: slice — последний сегмент пути ПЕРЕД FSD-сегментом
 * (ui/model/lib/api/config/assets) или файлом.
 *
 * Fallback: если FSD-сегмент не найден — берём последний сегмент после layer.
 *
 * @example
 * 'entities/User/model' → 'User'
 * 'entities/group/User/model' → 'User' (group folder)
 * 'entities/group/User' → 'User' (fallback)
 */
export function extractSlice(targetPath: string): string | null {
  /* Убираем имя файла (например, /index.ts или /model.ts) */
  const pathWithoutFile = targetPath.replace(/\/[\w-]+\.\w+$/, '');

  /* Разбиваем путь на сегменты */
  const parts = pathWithoutFile.split('/').filter(Boolean);

  /* Находим индекс layer (case-insensitive) */
  const layerIndex = parts.findIndex((part) =>
    layersWithSlices.some((layer) => layer.toLowerCase() === part.toLowerCase()),
  );

  /* Если layer не найден или после него ничего нет */
  if (layerIndex === -1 || layerIndex >= parts.length - 1) {
    return null;
  }

  /* Получаем части пути после layer */
  const partsAfterLayer = parts.slice(layerIndex + 1);

  /* Находим индекс первого FSD-сегмента (case-insensitive) */
  const segmentIndex = partsAfterLayer.findIndex((part) =>
    segments.some((seg) => seg.toLowerCase() === part.toLowerCase()),
  );

  /* Если FSD-сегмент найден и перед ним есть хотя бы один элемент */
  if (segmentIndex > 0) {
    return partsAfterLayer[segmentIndex - 1];
  }

  /* Edge case: FSD-сегмент сразу после layer (например entities/model/User/ui) */
  if (segmentIndex === 0) {
    return partsAfterLayer[0];
  }

  /* Fallback: FSD-сегмент не найден — берём последний сегмент */
  return partsAfterLayer[partsAfterLayer.length - 1] || null;
}
