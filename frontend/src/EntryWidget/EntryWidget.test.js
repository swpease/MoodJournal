import React from 'react';
import { createShallow } from 'material-ui/test-utils';

import { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

import EntryEditor from '../EntryEditor/EntryEditor.js';
import EntryWidget from './EntryWidget.js';


const setup = propOverrides => {
  const props = Object.assign({
    date: '2018-01-01',
    category: 'Dummy',
    rating: 'OK',
    entry: 'Todays entry',
    url: 'path/to/resource',
    qualityRatings: ['Good', 'OK', 'Bad'],
    handleDelete: jest.fn(),
    handleSave: jest.fn(),
  }, propOverrides);

  let shallow = createShallow();
  const wrapper = shallow(<EntryWidget {...props} />);
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('default displays the date', () => {
  let wrapper = setup();
  let cc = wrapper.find(CardContent).dive();
  // console.log(cc.containsMatchingElement('Dummy')); //true as well
  expect(cc.contains('2018-01-01')).toBeTruthy();
});

it('default displays the category', () => {
  let wrapper = setup();
  let cc = wrapper.find(CardContent).dive();
  expect(cc.contains('Dummy')).toBeTruthy();
});

it('default displays the rating', () => {
  let wrapper = setup();
  let cc = wrapper.find(CardContent).dive();
  expect(cc.contains('OK')).toBeTruthy();
});

it('default displays the entry', () => {
  let wrapper = setup();
  let cc = wrapper.find(CardContent).dive();
  expect(cc.contains('Todays entry')).toBeTruthy();
});

it('calls toggle upon Edit Btn click', () => {
  //ref: https://github.com/airbnb/enzyme/issues/944
  const spy = jest.spyOn(EntryWidget.prototype, 'toggleState');
  let wrapper = setup();
  let editBtn = wrapper.find(Button).at(0);
  editBtn.simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('calls DELETE upon delete btn click', () => {
  let wrapper = setup();
  let deleteBtn = wrapper.find(Button).at(1);
  deleteBtn.simulate('click');
  let handleDelete = wrapper.instance().props.handleDelete;
  expect(handleDelete.mock.calls.length).toBe(1);
});

it('displays an EntryEditor upon Edit button click', () => {
  let wrapper = setup();
  let editBtn = wrapper.find(Button).at(0);
  editBtn.simulate('click');
  let ee = wrapper.find(EntryEditor);
  expect(ee.length).toBe(1);
});

it('passes props to EntryEditor', () => {
  let wrapper = setup();
  let editBtn = wrapper.find(Button).at(0);
  editBtn.simulate('click');
  let ee = wrapper.find(EntryEditor);
  expect(ee.prop('url')).toBe(wrapper.instance().props.url);
  expect(ee.prop('date')).toBe(wrapper.instance().props.date);
  expect(ee.prop('category')).toBe(wrapper.instance().props.category);
  expect(ee.prop('handleSave')).toBe(wrapper.instance().props.handleSave);
  expect(ee.prop('qualityRatings')).toBe(wrapper.instance().props.qualityRatings);
  expect(ee.prop('rating')).toBe(wrapper.instance().props.rating);
  expect(ee.prop('entry')).toBe(wrapper.instance().props.entry);
  expect(ee.prop('handleCancel')).toBe(wrapper.instance().toggleState);
});
