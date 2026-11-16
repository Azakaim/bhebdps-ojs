describe('Домашнее задание к лекции «Классы в JavaScript»', () => {

  describe('Задача №1', () => {
    let printItem;

    beforeEach(function(){
      printItem = new PrintEditionItem('Типовой школьный журнал', 2019, 102);
    });

    it('создание печатного издания', () => {
      expect(printItem).toBeDefined();
      expect(printItem.name).toEqual('Типовой школьный журнал');
      expect(printItem.releaseDate).toEqual(2019);
      expect(printItem.pagesCount).toEqual(102);
      expect(printItem.state).toEqual(100);
      expect(printItem.type).toEqual(null);
    });

    it('починка почти целого печатного издания (ограничение сеттером state)', () => {
      printItem.state = 90;
      printItem.fix();
      expect(printItem.state).toEqual(100);
    });

    it('починка печатного издания', () => {
      printItem.state = 50;
      printItem.fix();
      expect(printItem.state).toEqual(75);
    });

    it('геттер для свойства state', () => {
      printItem.state = 10;
      const spy = spyOnProperty(printItem, 'state', 'get').and.returnValue(10);
      expect(printItem.state).toBe(10);
      expect(spy).toHaveBeenCalled();
    });
    
    it('сеттер для свойства state', () => {
      const spy = spyOnProperty(printItem, 'state', 'set');
      printItem.state = 10;
      expect(spy).toHaveBeenCalled();
    });

    it('создание объекта Magazine', () => {
      printItem = new Magazine('Forbes', 2020, 180);
      expect(printItem.type).toEqual("magazine");
    });
    
    it('создание объекта Book', () => {
      printItem = new Book('А. Сапковский', 'Меч Предназначения', 1992, 384);
      expect(printItem.author).toEqual('А. Сапковский');
      expect(printItem.name).toEqual('Меч Предназначения');
      expect(printItem.releaseDate).toEqual(1992);
      expect(printItem.pagesCount).toEqual(384);
      expect(printItem.type).toEqual('book');
    });

    it('создание объекта NovelBook', () => {
      printItem = new NovelBook('А. Сапковский', 'Меч Предназначения', 1992, 384);
      expect(printItem.author).toEqual('А. Сапковский');
      expect(printItem.type).toEqual('novel');
    });
    
    it('создание объекта FantasticBook', () => {
      printItem = new FantasticBook('Джон Толкин', 'Властелин колец', 1954, 2093);
      expect(printItem.author).toEqual('Джон Толкин');
      expect(printItem.type).toEqual('fantastic');
    });
    
    it('создание объекта DetectiveBook', () => {
      printItem = new DetectiveBook('Агата Кристи', 'Десять негритят', 2019, 256);
      expect(printItem.author).toEqual('Агата Кристи');
      expect(printItem.type).toEqual('detective');
    });
  });

  describe('Задача №2', () => {
    let library, printItem;
  
    beforeEach(function(){
      library = new Library('Библиотека имени Ленина');
      printItem = new PrintEditionItem('Типовой школьный журнал', 2019, 102);
    });

    it('создание библиотеки', () => {
      expect(library).toBeDefined();
      expect(library.name).toEqual('Библиотека имени Ленина');
      expect(library.books).toEqual(jasmine.any(Array));
    });
    
    it('добавление книги', () => {
      library.addBook(printItem);
      expect(library.books[0].name).toEqual('Типовой школьный журнал');
      expect(library.books.length).toEqual(1);
    });
    
    it('поиск книги', () => {
      const printItemAdditional = new PrintEditionItem('Блокнот для заметок', 2021, 100);
      library.addBook(printItemAdditional);
      library.addBook(printItem);
      const firstBook = library.findBookBy("releaseDate", 2019);
      expect(firstBook.name).toEqual('Типовой школьный журнал');
      const secondBook = library.findBookBy("releaseDate", 2154);
      expect(secondBook).toEqual(null);
    });
    
    it('выдача книги', () => {
      library.addBook(printItem);
      const firstBook = library.giveBookByName('Типовой школьный журнал');
      expect(firstBook.name).toEqual('Типовой школьный журнал');
      expect(library.books.length).toEqual(0);
      const secondBook = library.giveBookByName('Судовой журнал');
      expect(secondBook).toEqual(null);
    });
  })
});
describe('Проверка состояния изданий и работы библиотеки', function () {
  it('ограничивает состояние и не восстанавливает уничтоженное издание', function () {
    const book = new PrintEditionItem('Издание', 2020, 100);
    book.state = -10;
    expect(book.state).toBe(0);
    book.fix();
    expect(book.state).toBe(0);
    book.state = 120;
    expect(book.state).toBe(100);
  });

  it('принимает издания только в состоянии больше 30', function () {
    const library = new Library('Тестовая библиотека');
    const book = new Book('Автор', 'Название', 2020, 100);
    book.state = 30;
    library.addBook(book);
    expect(library.books.length).toBe(0);
    book.state = 31;
    library.addBook(book);
    expect(library.books[0]).toBe(book);
  });

  it('выдаёт, ремонтирует и принимает книгу обратно', function () {
    const library = new Library('Районная библиотека');
    const novel = new NovelBook('Сомерсет Моэм', 'Луна и грош', 1919, 320);
    const magazine = new Magazine('Наука и жизнь', 2020, 128);
    const fantastic = new FantasticBook('Герберт Уэллс', 'Машина времени', 1895, 138);
    library.addBook(novel);
    library.addBook(magazine);
    library.addBook(fantastic);

    expect(library.findBookBy('releaseDate', 1919)).toBe(novel);
    const issued = library.giveBookByName('Луна и грош');
    expect(issued).toBe(novel);
    expect(library.findBookBy('name', 'Луна и грош')).toBe(null);
    expect(library.books.length).toBe(2);

    issued.state = 25;
    library.addBook(issued);
    expect(library.books.length).toBe(2);
    issued.fix();
    expect(issued.state).toBe(37.5);
    library.addBook(issued);
    expect(library.books.length).toBe(3);
    expect(library.findBookBy('name', 'Луна и грош')).toBe(novel);

    expect(library.giveBookByName('Несуществующая книга')).toBe(null);
    expect(library.books.length).toBe(3);
  });
});
