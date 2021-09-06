import NewSubjectForm from '/js/components/subjects_form.js'
import RebrainMenu from '/js/components/menu.js'
import Api from '/js/libs/api.js'

Vue.use('menu')
Vue.use('table')
Vue.use(Buefy, {
    defaultProgrammaticPromise: true,
})

new Vue({
    el: '#app',
    components: {
        'new-subject-form': NewSubjectForm,
        'rebrain-menu': RebrainMenu,
    },
    data: {
        pageName: 'subjects',
        subjects: [],
        isLoading: true,
        newSubjectFormActive: false,
    },
    created: async function() {
        this.subjects = await Api.get_subjects()
        this.isLoading = false
    },
    methods: {
        async create_subject(subject) {
            await Api.create_subject(subject)
            this.subjects.push(subject)
            this.$emit('close')
        },
        async delete_subject(subject_id) {
            const subject = this.subjects.find(subject => subject.id == subject_id)
            const result = confirm(`Точно удалить предмет ${subject.title}?`)
            if (!result) {
                return;
            }
            await Api.delete_subject(subject_id)
            this.subjects = this.subjects.filter(subject => subject.id != subject_id)
        }
    },
})

