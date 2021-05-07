import {request} from './request.js'

export function updateImg() {
	return request({
		method: 'post',
		url:'/avatar/upload',
		headers: {
		  'Content-Type': 'multipart/form-data',
		},
		data: formData
	})
}
