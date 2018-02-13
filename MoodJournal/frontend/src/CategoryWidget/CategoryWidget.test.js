import React from 'react';

import { createShallow } from 'material-ui/test-utils';
import { ListItem, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

import CategoryDeleter from '../CategoryDeleter/CategoryDeleter.js';
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';
import CategoryWidget from './CategoryWidget.js';

const setup = propOverrides => {
  const props = Object.assign({
    url: 'path/to/resource',
    category: 'Dummy',
    handleDelete: jest.fn(),
    handleUpdate: jest.fn(),
  }, propOverrides);

  let shallow = createShallow({untilSelector: 'CategoryWidget'}); // b/c withStyles HOC
  const wrapper = shallow(<CategoryWidget {...props} />);
  return wrapper;
};


it('renders without crashing', () => {
  setup();
});

it('displays a ListItem (displayed as div) by default', () => {
  let wrapper = setup();
  let listItem = wrapper.find(ListItem);
  expect(listItem.length).toBe(1);
});

it('passes `primary` prop to ListItemText', () => {
  let wrapper = setup();
  let lit = wrapper.find(ListItemText);
  expect(lit.prop('primary')).toBe(wrapper.instance().props.category);
});

it('passes className prop to ListItemText', () => {
  let wrapper = setup();
  let lit = wrapper.find(ListItemText);
  expect(lit.prop('className')).toBe(wrapper.instance().props.classes.text);
});

it('passes handleDelete and url to CategoryDeleter', () => {
  let wrapper = setup();
  let cd = wrapper.find(CategoryDeleter);
  expect(cd.prop('url')).toBe(wrapper.instance().props.url);
  expect(cd.prop('handleDelete')).toBe(wrapper.instance().props.handleDelete);
});

it('displays a CategoryEditor upon edit button click', () => {
  let wrapper = setup();
  let editBtn = wrapper.find(IconButton).first();
  editBtn.simulate('click');
  let ce = wrapper.find(CategoryEditor);
  expect(ce.length).toBe(1);
});

it('passes a bunch of props to CategoryEditor upon view', () => {
  let wrapper = setup();
  let editBtn = wrapper.find(IconButton).first();
  editBtn.simulate('click');
  let ce = wrapper.find(CategoryEditor);
  expect(ce.prop('url')).toBe(wrapper.instance().props.url);
  expect(ce.prop('category')).toBe(wrapper.instance().props.category);
  expect(ce.prop('handleSave')).toBe(wrapper.instance().props.handleUpdate);
  expect(ce.prop('handleClose')).toBe(wrapper.instance().toggleState);
});
