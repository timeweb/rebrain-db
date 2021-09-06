import NewClassForm from '/js/components/classes_form.js'
import ClassroomTeacherForm from '/js/components/classroom_teacher_form.js'
import StudentsForm from '/js/components/students_form.js'
import RebrainMenu from '/js/components/menu.js'
import Api from '/js/libs/api.js'

Vue.use('menu')
Vue.use('table')
Vue.use('select')
Vue.use(Buefy, {
    defaultProgrammaticPromise: true,
})

new Vue({
    el: '#app',
    components: {
        'new-class-form': NewClassForm,
        'classroom-teacher-form': ClassroomTeacherForm,
        'students-form': StudentsForm,
        'rebrain-menu': RebrainMenu,
    },
    data: {
        pageName: 'classes',
        classes: [],
        users: [],
        classroom_teachers: [],
        students_classes: [],
        isLoading: true,
        currentClassId: null,
        newClassFormActive: false,
        classroomTeacherFormActive: false,
        studentsFormActive: false,
    },
    created: async function() {
        let api_data = await Promise.all([
            Api.get_users(),
            Api.get_classes(),
            Api.get_classroom_teachers(),
            Api.get_students_classes(),
        ])
        
        // destructuring doesnt work with 'this' :(
        this.users = api_data[0]
        this.classes = api_data[1]
        this.classroom_teachers = api_data[2]
        this.students_classes = api_data[3]

        this.isLoading = false
    },
    methods: {
        getTeachers() {
            return this.users.filter(user => user.role == 'teacher')
        },
        getStudents() {
            return this.users.filter(user => user.role == 'student')
        },
        getClassroomTeacher(class_id) {
            const clst = this.classroom_teachers.find(clst => clst.class_id == class_id)
            if (typeof clst === 'undefined') {
                return null
            }
            const teacher = this.getTeachers().find(teacher => teacher.id === clst.teacher_id)
            if (typeof teacher === 'undefined') {
                return null
            }
            return teacher
        },
        getFreeTeachers() {
            const busyTeachers = this.classroom_teachers.map(clst => clst.teacher_id)
            return this.getTeachers().filter(teacher => !busyTeachers.includes(teacher.id))
        },
        showClassroomTeacherForm(clsId) {
            this.currentClassId = clsId
            this.classroomTeacherFormActive = true
        },
        showStudentsForm(clsId) {
            this.currentClassId = clsId
            this.studentsFormActive = true
        },
        getClassStudents(class_id) {
            const students = this.students_classes.filter(stdcl => stdcl.class_id == class_id)
                .map(student => student.id)
            console.log(students)
            return students
        },
        async setClassroomTeacher(teacher_id, class_id) {
            await Api.set_classroom_teacher(teacher_id, class_id)
            this.classroom_teachers = this.classroom_teachers.filter(clst => clst.class_id != class_id)
            this.classroom_teachers.push({id: null, teacher_id, class_id})
            this.$emit('close')
        },
        async setStudents(students_ids, class_id) {
            await Api.set_students_classes(students_ids, class_id)
            this.students_classes = await Api.get_students_classes()
            this.$emit('close')
        },
        async create_class(cls) {
            await Api.create_class(cls)
            this.classes.push(cls)
            this.$emit('close')
        },
        async delete_class(class_id) {
            const cls = this.classes.find(cls => cls.id == class_id)
            const result = confirm(`Точно удалить класс ${cls.number}${cls.letter}?`)
            if (!result) {
                return;
            }
            await Api.delete_class(class_id)
            this.classes = this.classes.filter(cls => cls.id != class_id)
        },
    },
})

