import React from 'react';
import { createMount } from 'material-ui/test-utils';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';

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

  let mount = createMount();
  const wrapper = mount(<CategoryWidget {...props} />);
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
  expect(lit.prop('primary')).toBe(wrapper.prop('category'));
});

it('passes handleDelete and url to CategoryDeleter', () => {
  let wrapper = setup();
  let cd = wrapper.find(CategoryDeleter);
  expect(cd.prop('url')).toBe(wrapper.prop('url'));
  expect(cd.prop('handleDelete')).toBe(wrapper.prop('handleDelete'));
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
  expect(ce.prop('url')).toBe(wrapper.prop('url'));
  expect(ce.prop('category')).toBe(wrapper.prop('category'));
  expect(ce.prop('handleSave')).toBe(wrapper.prop('handleUpdate'));
  console.log(wrapper.debug())
  expect(ce.prop('handleClose')).toBe(wrapper.instance().toggleState);
});
