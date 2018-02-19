import React from 'react';
import { shallow } from 'enzyme';

import Dialog, {
  DialogActions,
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';

import CategoryDeleter from './CategoryDeleter.js';

const setup = propOverrides => {
  const props = Object.assign({
    url: "path/to/resource",
    handleDelete: jest.fn(),
  }, propOverrides);

  const wrapper = shallow(<CategoryDeleter {...props} />);

  return wrapper;
}

// Smoke test:
it('renders without crashing', () => {
  setup();
});

// Content:
it('displays a dialog only after clicking the delete button', () => {
  let wrapper = setup();
  let delBtn = wrapper.find(IconButton);
  let dialog = wrapper.find(Dialog);
  expect(dialog.prop('open')).toBeFalsy();
  delBtn.simulate('click');
  let postClickDialog = wrapper.find(Dialog);
  expect(postClickDialog.prop('open')).toBeTruthy();
});

it('calls delete handler upon dialog confirmation', () => {
  let wrapper = setup();
  let confirmBtn = wrapper.find(DialogActions).childAt(1);
  confirmBtn.simulate('click');
  let handleDelete = wrapper.instance().props.handleDelete;
  expect(handleDelete.mock.calls.length).toBe(1);
});
// 
// it('closes a dialog after clicking Cancel button', () => {
//   let wrapper = setup();
//   let cancelBtn = wrapper.find(DialogActions).at(0);
//   cancelBtn.simulate('click');
//   let handleClose =
// })
