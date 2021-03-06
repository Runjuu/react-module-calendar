import { expect } from 'chai';
import filterSelected from './';

export default () => (
  describe('filterSelected', () => {
    it('当传入的 dateString 格式不为 YYYY-MM-DD 的格式时，直接返回传入的 selected', () => {
      const selected = { '2017-01-28': false };
      expect(filterSelected('a', selected, 'MULTIPLE')).to.be.equal(selected);
      expect(filterSelected('2017', selected, 'MULTIPLE')).to.be.equal(selected);
      expect(filterSelected(undefined, selected, 'MULTIPLE')).to.be.equal(selected);
      expect(filterSelected(1234, selected, 'MULTIPLE')).to.be.equal(selected);
      expect(filterSelected(true, selected, 'MULTIPLE')).to.be.equal(selected);
    });
    describe('INTERVAL', () => {
      it('当 selected 为空对象时，应当返回 key 为 dateString，value 为 true 的对象', () => {
        expect(filterSelected('2017-01-28', {}, 'INTERVAL')).to.deep.equal({ '2017-01-28': true });
      });
      it('当传入的 dateString 比 selected 中任何一个日期都早时，应当返回 key 为 dateString，value 为 true 的对象', () => {
        expect(filterSelected('2017-01-28', { '2017-02-06': true }, 'INTERVAL')).to.deep.equal({ '2017-01-28': true });
        expect(filterSelected('2017-01-28', { '2017-01-29': true, '2017-01-30': true }, 'INTERVAL')).to.deep.equal({ '2017-01-28': true });
      });
      it('当传入的 dateString 比 selected 中的日期晚，且 selected 中只有一个日期为 true 时，返回的对象中应当包含两个日期以及之间的所有日期', () => {
        expect(filterSelected('2017-02-01', { '2017-01-30': true }, 'INTERVAL')).to.deep.equal({
          '2017-01-30': true,
          '2017-01-31': true,
          '2017-02-01': true,
        });
        expect(filterSelected('2017-02-01', { '2017-01-30': true, '2017-01-31': false }, 'INTERVAL')).to.deep.equal({
          '2017-01-30': true,
          '2017-01-31': true,
          '2017-02-01': true,
        });
      });
      it('只要 selected 中存在 true 的日期大于一天，dateString 中无论传什么日期，都应当返回 key 为 dateString，value 为 true 的对象', () => {
        expect(filterSelected('2017-02-01', { '2017-01-29': false, '2017-01-30': true, '2017-01-31': true }, 'INTERVAL')).to.deep.equal({ '2017-02-01': true });
        expect(filterSelected('2017-02-01', { '2017-01-30': true, '2017-01-31': true }, 'INTERVAL')).to.deep.equal({ '2017-02-01': true });
        expect(filterSelected('2017-02-01', { '2017-01-31': true, '2017-02-01': true }, 'INTERVAL')).to.deep.equal({ '2017-02-01': true });
        expect(filterSelected('2017-02-01', { '2017-02-01': true, '2017-02-02': true }, 'INTERVAL')).to.deep.equal({ '2017-02-01': true });
        expect(filterSelected('2017-02-01', { '2017-02-02': true, '2017-02-03': true }, 'INTERVAL')).to.deep.equal({ '2017-02-01': true });
      });
    });
    describe('MULTIPLE', () => {
      it('返回的值应当包含传入的 dateString 和 selected 原有的日期', () => {
        expect(filterSelected('2017-01-28', {}, 'MULTIPLE')).to.deep.equal({ '2017-01-28': true });
        expect(filterSelected('2017-01-28', { '2017-01-29': true }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': true, '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-01-28': true }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': true, '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-01-01': true }, 'MULTIPLE')).to.deep.equal({ '2017-01-01': true, '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-02-02': true }, 'MULTIPLE')).to.deep.equal({ '2017-02-02': true, '2017-01-29': true });
      });
      it('当 selected 中存在 dateString 的日期时，返回的对象中 dateString 为原 selected 的相反值', () => {
        expect(filterSelected('2017-01-28', { '2017-01-28': false }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': true });
        expect(filterSelected('2017-01-28', { '2017-01-28': true }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': false });
      });
      it('无论 dateString 的日期是几号，selected 中包含哪些日期，selected 中的日期是否为 true，返回值都会包含这些日期', () => {
        expect(filterSelected('2017-01-28', { '2017-02-06': true }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': true, '2017-02-06': true });
        expect(filterSelected('2017-02-06', { '2017-01-28': true }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': true, '2017-02-06': true });
        expect(filterSelected('2017-02-06', { '2017-01-28': false }, 'MULTIPLE')).to.deep.equal({ '2017-01-28': false, '2017-02-06': true });
      });
    });
    describe('SINGLE', () => {
      it('无论 selected 中包含哪些值，应当返回 key 为 dateString，value 为 true 的对象', () => {
        expect(filterSelected('2017-01-29', { '2017-02-02': true }, 'SINGLE')).to.deep.equal({ '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-02-02': false }, 'SINGLE')).to.deep.equal({ '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-02-01': true, '2017-02-02': false }, 'SINGLE')).to.deep.equal({ '2017-01-29': true });
      });
      it('当 selected 中存在 dateString 的日期时，应当返回 key 为 dateString，value 为 selected 中 dateString 的相反值', () => {
        expect(filterSelected('2017-01-29', { '2017-01-29': false }, 'SINGLE')).to.deep.equal({ '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-01-29': true }, 'SINGLE')).to.deep.equal({ '2017-01-29': false });
        expect(filterSelected('2017-01-29', { '2017-01-29': false, '2017-02-02': true }, 'SINGLE')).to.deep.equal({ '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-01-29': false, '2017-02-02': false }, 'SINGLE')).to.deep.equal({ '2017-01-29': true });
        expect(filterSelected('2017-01-29', { '2017-01-29': true, '2017-02-02': true }, 'SINGLE')).to.deep.equal({ '2017-01-29': false });
        expect(filterSelected('2017-01-29', { '2017-01-29': true, '2017-02-02': false }, 'SINGLE')).to.deep.equal({ '2017-01-29': false });
      });
    });
  })
);
