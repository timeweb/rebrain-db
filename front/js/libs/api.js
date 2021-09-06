export default {
    async api_request(method, args) {
        let raw_response = await fetch('/api', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({method, args})
        })
        let response = await raw_response.json()
        return new Promise((resolve, reject) => {
            if (response.status == 'ok') {
                resolve(response.data)
            } else {
                alert(response.error)
                reject(response.error)
            }
        })
    },
    
    getTeachers(users) {
        return users.filter(user => user.role == 'teacher')
    },
    getStudents(users) {
        return users.filter(user => user.role == 'student')
    },
    get_classroom_teacher(classroom_teachers, class_id) {
        const clst = classroom_teachers.find(clst => clst.class_id == class_id)
        if (clst === null) {
            return null
        }
        return clst.teacher_id
    },
    
    async get_classroom_teachers() {
        return this.api_request('get', {table: 'classroom_teachers'})
    },
    async get_classes() {
        return this.api_request('get', {table: 'classes'})
    },
    async get_subjects() {
        return this.api_request('get', {table: 'subjects'})
    },
    async get_users() {
        return this.api_request('get', {table: 'users'})
    },
    async get_students_classes() {
        return this.api_request('get', {table: 'students_classes'})
    },

    async create_class(cls) {
        return this.api_request('create', {table: 'classes', item: cls})
    },
    async create_subject(subject) {
        return this.api_request('create', {table: 'subjects', item: subject})
    },
    async create_user(user) {
        return this.api_request('create', {table: 'users', item: user})
    },

    async set_classroom_teacher(teacher_id, class_id) {
        return this.api_request('set_classroom_teacher', {teacher_id, class_id})
    },
    async set_students_classes(students_ids, class_id) {
        return this.api_request('set_students_classes', {students_ids, class_id})
    },

    async delete_class(class_id) {
        return this.api_request('delete', {table: 'classes', item_id: class_id})
    },
    async delete_subject(subject_id) {
        return this.api_request('delete', {table: 'subjects', item_id: subject_id})
    },
    async delete_user(user_id) {
        return this.api_request('delete', {table: 'users', item_id: user_id})
    },

}
