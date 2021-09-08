import NewUserForm from '/js/components/users_form.js'
import RebrainMenu from '/js/components/menu.js'
import RebrainSchedule from '/js/components/schedule.js'
import Api from '/js/libs/api.js'

Vue.use('menu')
Vue.use('table')
Vue.use(Buefy, {
    defaultProgrammaticPromise: true,
})

new Vue({
    el: '#app',
    components: {
        'new-user-form': NewUserForm,
        'rebrain-menu': RebrainMenu,
        'rebrain-schedule': RebrainSchedule,
    },
    data: {
        pageName: 'schedule',
        subjects: [],
        users: [],
        classes: [],
        lessons: [],
        roles: {
            teacher: 'Учитель',
            student: 'Ученик',
        },
        isLoading: true,
        newUserFormActive: false,
        currentClsId: null,
    },
    created: async function() {
        let api_data = await Promise.all([
            Api.get_users(),
            Api.get_subjects(),
            Api.get_classes(),
            Api.get_lessons(),
        ])

        this.users = api_data[0]
        this.subjects = api_data[1]
        this.classes = api_data[2]
        this.lessons = api_data[3]

        this.isLoading = false
    },
    methods: {
        getTeachers() {
            return this.users.filter(user => user.role == 'teacher')
        },
        getLessons(clsId) {
            return this.lessons.filter(lesson => lesson.class_id == clsId)
        },
        async create_user(user) {
            await Api.create_user(user)
            this.users.push(user)
            this.$emit('close')
        },
        async delete_user(user_id) {
            const user = this.users.find(user => user.id == user_id)
            const result = confirm(`Точно удалить пользователя ${user.fio}?`)
            if (!result) {
                return;
            }
            await Api.delete_user(user_id)
            this.users = this.users.filter(user => user.id != user_id)
        },
        get_lesson(weekday, num, clsId) {
            clsId = parseInt(clsId)
            num = parseInt(num)
            let lesson = this.lessons.find(lesson => lesson.weekday == weekday && lesson.num == num && lesson.class_id == clsId)
            if (typeof lesson == 'undefined') {
                lesson = {
                    id: null,
                    weekday: weekday,
                    num: num,
                    class_id: clsId,
                    subject_id: null,
                    teacher_id: null,
                }
                this.lessons.push(lesson)
            }
            return lesson
        },
        set_subject(weekday, num, clsId, subject_id) {
            if (clsId === null) {
                alert('Выберите класс!')
                return
            }
            let lesson = this.get_lesson(weekday, num, clsId)
            lesson.subject_id = parseInt(subject_id)
        },
        set_teacher(weekday, num, clsId, teacher_id) {
            if (clsId === null) {
                alert('Выберите класс!')
                return
            }
            let lesson = this.get_lesson(weekday, num, clsId)
            lesson.teacher_id = parseInt(teacher_id)
        },
        async set_lesson(lesson) {
            console.log(lesson)
            await Api.set_lesson(lesson.weekday, lesson.num, lesson.class_id, lesson.subject_id, lesson.teacher_id)
            this.lessons.push(lesson)
        },
    },
})

