import {
  relativeToRoot,
  rerootTargetPath,
} from './resolution-paths';

describe('resolution-paths', () => {
  describe('relativeToRoot', () => {
    it('returns the path without the root', () => {
      expect(relativeToRoot('/proj/src/entities/user/model', '/proj')).toBe('src/entities/user/model');
    });

    it('keeps the original casing of the path when the root disagrees on case', () => {
      expect(relativeToRoot('/Proj/src/Entities/User/model', '/proj')).toBe('src/Entities/User/model');
    });

    it('drops every leading slash left by the root', () => {
      expect(relativeToRoot('/proj//src/entities', '/proj')).toBe('src/entities');
    });

    it('returns null without a root', () => {
      expect(relativeToRoot('/proj/src/entities', undefined)).toBeNull();
    });

    it('returns null for an empty root', () => {
      expect(relativeToRoot('/proj/src/entities', '')).toBeNull();
    });

    it('returns null when the path does not lie under the root', () => {
      expect(relativeToRoot('@/entities/user/model', '/proj')).toBeNull();
    });
  });

  describe('rerootTargetPath', () => {
    const currentFile = '/proj/src/widgets/header/Header.ts';

    it('roots an aliased target under the current file layer root', () => {
      expect(rerootTargetPath(currentFile, '@/widgets/header/hooks', '/proj'))
        .toBe('/proj/src/widgets/header/hooks');
    });

    it('roots a bare target that starts with the layers root', () => {
      expect(rerootTargetPath(currentFile, 'src/widgets/header/hooks', '/proj'))
        .toBe('/proj/src/widgets/header/hooks');
    });

    it('substitutes the layer when the two sides sit on different layers', () => {
      expect(rerootTargetPath(currentFile, '@/entities/user/model', '/proj'))
        .toBe('/proj/src/entities/user/model');
    });

    it('leaves an already rooted target pointing at the same directory', () => {
      expect(rerootTargetPath(currentFile, '/proj/src/widgets/header/hooks/use-x', '/proj'))
        .toBe('/proj/src/widgets/header/hooks/use-x');
    });

    it('returns null for a package specifier, which carries no layer', () => {
      expect(rerootTargetPath(currentFile, 'lodash', '/proj')).toBeNull();
    });

    it('returns null when the current file carries no layer', () => {
      expect(rerootTargetPath('/proj/scripts/build.ts', '@/widgets/header/hooks', '/proj')).toBeNull();
    });

    it('returns null when the current file does not lie under the root', () => {
      expect(rerootTargetPath(currentFile, '@/widgets/header/hooks', '/other')).toBeNull();
    });

    it('returns null without a root', () => {
      expect(rerootTargetPath(currentFile, '@/widgets/header/hooks', undefined)).toBeNull();
    });

    it('anchors on the layer inside the project, not on a checkout directory named like one', () => {
      expect(rerootTargetPath('/home/me/entities/proj/src/widgets/header/Header.ts', '@/entities/user/model', '/home/me/entities/proj'))
        .toBe('/home/me/entities/proj/src/entities/user/model');
    });
  });
});
