// New VueJS instance
new Vue({
  name: 'notebook',

  // CSS selector of the root DOM element
  el: '#notebook',

  // Some data
  data () {
    return {
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      selectedNoteId: localStorage.getItem('selectedNoteId') || null,
    }
  },

  // Computed properties
  computed: {
    notePreview(){
      // Markdown rendered to HTML
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },

    addButtonTitle(){
      return this.notes.length + ' note(s) already'
    },

    selectedNote(){
      return this.notes.find(note => note.id === this.selectedNoteId);
    },

    sortedNotes () {
      return this.notes.slice()
          .sort((a, b) => a.created - b.created)
          .sort((a, b) => (a.is_favorite === b.is_favorite) ? 0
              : a.is_favorite ? -1 : 1)
    },
  },

  // Change watchers
  watch: {
    notes: {
      handler: 'saveNote',
      deep: true
    },
    selectedNoteId: {
      handler(newVal){
        localStorage.setItem('selectNoteId', newVal)
      }
    }
  },

  methods: {
    saveNote(val, oldVal){
      localStorage.setItem('notes', JSON.stringify(this.notes))
    },

    addNote(){
      let time = Date.now();

      const note = {
        id: String(time),
        title: 'New note ' + (this.notes.length + 1),
        content: 'New content here',
        created_at: time,
        is_favorite: false,
      }

      this.notes.push(note);
    },

    removeNote() {
      if(this.selectedNote && confirm('Delete this note ?')) {
        let index = this.notes.indexOf(this.selectedNote);
        if (index !== -1) {
          this.notes.splice(index, 1)
        }
      }
    },

    favoriteNote() {
      this.selectedNote.is_favorite = !this.selectedNote.is_favorite
    },

    selectNote(note) {
      this.selectedNoteId = note.id;
    }
  },
})

Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))
